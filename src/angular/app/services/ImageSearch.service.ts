import { Injectable } from "@angular/core";
import { TypeORMService } from "./TypeOrm.service";
import { FTPService, FTPConnection } from "./ftp.service";
import { FileSystem } from "src/types/entity/FileSystem";
import { ElectronService } from "./electron.service";
import { File } from "src/types/entity/File";
import * as ftp from "basic-ftp";
import * as async from "async";
import * as streamBuffers from "stream-buffers";
// import * as sharp from "sharp";
import { stdout } from "process";
import { ProgressService } from "./progress.service";
@Injectable({
  providedIn: "root"
})
export class ImageSearchService {
  allowedExtension = [".png", ".jpeg", ".jpg"];
  filesToCreate: File[] = [];
  streamBuffers: typeof streamBuffers;
  // sharp: typeof sharp;
  constructor(
    private typeORMService: TypeORMService,
    private ftpService: FTPService,
    private electron: ElectronService,
    private progressService: ProgressService
  ) {
    this.streamBuffers = this.electron.remote.require("stream-buffers");
  }

  thumbNail(element: FileSystem) {
    this.filesToCreate = [];
    this.progressService.mode = "determinate";
    this.progressService.activate();
    this.ftpService
      .connect({
        host: element.ftpHost,
        user: element.ftpUser,
        password: element.ftpPass
      })
      .then(client => {
        this.typeORMService
          .getConnection()
          .then(conn => {
            const rep = conn.getRepository<File>("File");
            rep
              .find({ where: { fileSystem: element } })
              .then(files => {
                const onePercent = (1 / files.length) * 100;
                async.eachSeries(
                  files,
                  (file, callback) => {
                    client
                      .getFile("/" + file.ftpPath)
                      .then((stream: streamBuffers.WritableStreamBuffer) => {
                        const bufs = stream.getContents();
                        this.electron.remote
                          .require("sharp")(bufs)
                          .resize(200)
                          .toBuffer()
                          .then(resBuf => {
                            file.thumb = resBuf.toString("base64");
                            this.filesToCreate.push(file);
                            this.progressService.value += onePercent;
                            callback();
                          });
                      })
                      .catch(err => {
                        console.log(err);
                        callback();
                      });
                  },
                  () => {
                    rep.save(this.filesToCreate);
                    this.progressService.close();
                    client.logout();
                  }
                );
              })
              .catch(err => {
                console.log(err);
                client.logout();
                this.progressService.close();
              });
          })
          .catch(() => {
            client.logout();
            this.progressService.close();
            console.log("err");
          });
      })
      .catch(() => {
        this.progressService.close();
        console.log("err");
      });
  }

  searchFor(element: FileSystem) {
    this.filesToCreate = [];
    this.progressService.mode = "indeterminate";
    this.progressService.activate();
    this.ftpService
      .connect({
        host: element.ftpHost,
        user: element.ftpUser,
        password: element.ftpPass
      })
      .then(client => {
        client.getListOfFiles("").then((files: ftp.FileInfo[]) => {
          this.searchThroughFiles(files, element, client, "./")
            .then(() => {
              this.typeORMService.getConnection().then(conn => {
                const rep = conn.getRepository<File>("File");
                async.eachOfSeries(
                  this.filesToCreate,
                  (fileToCreate, key, callback) => {
                    rep
                      .findOneOrFail({
                        where: {
                          ftpPath: fileToCreate.ftpPath,
                          fileSystem: fileToCreate.fileSystem
                        },
                        relations: ["fileSystem", "album"]
                      })
                      .then(existingFile => {
                        fileToCreate.id = existingFile.id;
                        fileToCreate.fileSystem = existingFile.fileSystem;
                        fileToCreate.album = existingFile.album;
                        rep.save(fileToCreate);
                        callback();
                      })
                      .catch(() => {
                        const fileToSave = rep.create(fileToCreate);
                        rep.save(fileToSave);
                        callback();
                      });
                  }
                );
              });
              client.logout();
              this.progressService.close();
            })
            .catch(() => {
              client.logout();
              this.progressService.close();
            });
        });
      })
      .catch(() => {
        console.log("err");
        this.progressService.close();
      });
  }

  private searchThroughFiles(
    files: ftp.FileInfo[],
    element: FileSystem,
    client: FTPConnection,
    path: string
  ) {
    return new Promise<any>((res, rej) => {
      if (files !== undefined) {
        files = files.filter(val => val.name !== "." && val.name !== "..");
        async.eachOfSeries(
          files,
          (file, key, callback) => {
            if (file.isFile) {
              const extension = this.electron.path.extname(file.name);
              if (this.allowedExtension.includes(extension.toLowerCase())) {
                const fileToCreate = new File();
                fileToCreate.name = file.name;
                fileToCreate.ftpPath = this.electron.path.join(path, file.name);
                fileToCreate.webPath = fileToCreate.ftpPath;
                fileToCreate.fileSystem = element;
                client.client
                  .lastMod(fileToCreate.ftpPath)
                  .then(date => {
                    fileToCreate.createdAt = date;
                    this.filesToCreate.push(fileToCreate);
                    callback();
                  })
                  .catch(() => {
                    fileToCreate.createdAt = new Date(Date.parse(file.date));
                    this.filesToCreate.push(fileToCreate);
                    callback();
                  });
              } else {
                console.log(file.name);
                callback();
              }
            } else if (file.isDirectory) {
              client
                .getListOfFiles(this.electron.path.join(path, file.name))
                .then((nfiles: ftp.FileInfo[]) => {
                  this.searchThroughFiles(
                    nfiles,
                    element,
                    client,
                    this.electron.path.join(path, file.name)
                  )
                    .then(() => {
                      callback();
                    })
                    .catch(err => {
                      rej(err);
                    });
                })
                .catch(err => {
                  rej(err);
                });
            } else {
              callback();
            }
          },
          () => {
            res();
          }
        );
      } else {
        rej();
      }
    });
  }
}
