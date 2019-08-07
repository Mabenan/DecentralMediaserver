import { Injectable } from "@angular/core";
import { TypeORMService } from "./TypeOrm.service";
import { FTPService, FTPConnection } from "./ftp.service";
import { FileSystem } from "src/types/entity/FileSystem";
import { ElectronService } from "./electron.service";
import { File } from "src/types/entity/File";
import * as ftp from "ftp";
@Injectable({
  providedIn: "root"
})
export class ImageSearchService {
  allowedExtension = ["png", "jpeg", "jpg"];
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
          this.searchThroughFiles(files, element, client);
        });
      })
      .catch(() => {
        console.log("err");
      });
  }

  private searchThroughFiles(
    files: ftp.ListingElement[],
    element: FileSystem,
    client: FTPConnection
  ) {
    if (files !== undefined) {
      files.forEach(file => {
        if (file.type === "-") {
          const extension = this.electron.path.extname(file.name);
          if (this.allowedExtension.includes(extension)) {
            this.typeORMService.getConnection().then(conn => {
              const rep = conn.getRepository<File>("File");
              let dfile = new File();
              dfile.fileSystem = element;
              dfile.createdAt = file.date;
              dfile.ftpPath = "/" + file.name;
              dfile.webPath = dfile.ftpPath;
              dfile = rep.create(dfile);
              rep.save(dfile);
            });
          }
        } else {
          client
            .getListOfFiles(file.name)
            .then((nfiles: ftp.ListingElement[]) => {
              this.searchThroughFiles(nfiles, element, client);
            });
        }
      });
    }
  }
}
