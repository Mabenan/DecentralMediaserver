import { Injectable } from "@angular/core";
import { TypeORMService } from "./TypeOrm.service";
import { FTPService, FTPConnection } from "./ftp.service";
import { FileSystem } from "src/types/entity/FileSystem";
import { ElectronService } from "./electron.service";
import { File } from "src/types/entity/File";
import * as ftp from "ftp";
import * as async from "async";
@Injectable({
  providedIn: "root"
})
export class ImageSearchService {
  allowedExtension = [".png", ".jpeg", ".jpg"];
  filesToCreate: File[] = [];
  constructor(
    private typeORMService: TypeORMService,
    private ftpService: FTPService,
    private electron: ElectronService
  ) {}
  searchFor(element: FileSystem) {
    this.ftpService
      .connect({
        host: element.ftpHost,
        user: element.ftpUser,
        password: element.ftpPass
      })
      .then(client => {
        client.getListOfFiles("").then((files: ftp.ListingElement[]) => {
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
                      .then((existingFile) => {
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
            })
            .catch(() => {
              client.logout();
            });
        });
      })
      .catch(() => {
        console.log("err");
      });
  }

  private searchThroughFiles(
    files: ftp.ListingElement[],
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
            if (file.type !== undefined) {
              if (file.type === "-") {
                const extension = this.electron.path.extname(file.name);
                if (this.allowedExtension.includes(extension.toLowerCase())) {
                  const fileToCreate = new File();
                  fileToCreate.name = file.name;
                  fileToCreate.ftpPath = path + file.name;
                  fileToCreate.webPath = fileToCreate.ftpPath;
                  fileToCreate.fileSystem = element;
                  fileToCreate.createdAt = file.date;
                  this.filesToCreate.push(fileToCreate);
                } else {
                  console.log(file.name);
                }
                callback();
              } else {
                client
                  .cwd(this.electron.path.basename(path))
                  .then(() => {
                    client
                      .getListOfFiles(file.name)
                      .then((nfiles: ftp.ListingElement[]) => {
                        this.searchThroughFiles(
                          nfiles,
                          element,
                          client,
                          path + file.name + "/"
                        )
                          .then(() => {
                            client.cwd("..").then(() => {
                              callback();
                            });
                          })
                          .catch(() => {
                            rej();
                          });
                      })
                      .catch(() => {
                        rej();
                      });
                  })
                  .catch(() => rej());
              }
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
