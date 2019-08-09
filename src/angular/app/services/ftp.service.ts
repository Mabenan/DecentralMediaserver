import { Injectable } from "@angular/core";
import { ElectronService } from "./electron.service";
import * as fs from "fs";
import * as ftp from "basic-ftp";
import { Stream } from "stream";
import * as streamBuffers from "stream-buffers";

export class FTPConnection {
  getFile(ftpPath: string): Promise<streamBuffers.WritableStreamBuffer> {
    return new Promise<Stream>((res, rej) => {
      const reader = new (<any>this.electron.remote.require("stream-buffers")).WritableStreamBuffer();
      this.client
        .download(reader, ftpPath.replace(/\\/g, "/"))
        .then(() => {
          res(reader);
        })
        .catch(err => {
          rej(err);
        });
    });
  }

  constructor(private client: ftp.Client, private electron: ElectronService) {}
  getListOfFiles(path: string): Promise<ftp.FileInfo[]> {
    console.log(path);
    return new Promise<any[]>((res, rej) => {
      this.client
        .list(path)
        .then(listing => {
          res(listing);
        })
        .catch(err => {
          rej(err);
        });
    });
  }
  logout() {
    this.client.close();
  }
}
@Injectable({
  providedIn: "root"
})
export class FTPService {
  ftp: typeof ftp;

  constructor(private electron: ElectronService) {
    this.ftp = this.electron.remote.require("basic-ftp");
  }

  connect(options: ftp.AccessOptions): Promise<FTPConnection> {
    return new Promise<any>((res, rej) => {
      const client = new this.ftp.Client();
      client
        .access(options)
        .then(() => {
          res(new FTPConnection(client, this.electron));
        })
        .catch(err => {
          console.log(err.code);
          rej();
        });
    });
  }
}
