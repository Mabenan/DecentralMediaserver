import { Injectable } from "@angular/core";
import { ElectronService } from "./electron.service";
import * as fs from "fs";
import * as ftp from "ftp";

export class FTPConnection {
  cwd(arg0: string): Promise<any> {
    return new Promise<any>((res, rej) =>
      this.client.cwd(arg0, (error) => {
        if (error) {rej();} else {
        res();
        }
      })
    );
  }

  constructor(private client: ftp) {}
  getListOfFiles(path: string): Promise<ftp.ListingElement[]> {
    console.log(path);
    return new Promise<any[]>((res, rej) => {
      this.client.listSafe(
        path,
        (err: Error, listing: ftp.ListingElement[]) => {
          res(listing);
        }
      );
    });
  }
  logout() {
    this.client.logout(() => {
      this.client.destroy();
    });
  }
}
@Injectable({
  providedIn: "root"
})
export class FTPService {
  ftp: typeof ftp;

  constructor(private electron: ElectronService) {
    this.ftp = this.electron.remote.require("ftp");
  }

  connect(options: ftp.Options): Promise<FTPConnection> {
    return new Promise<any>((res, rej) => {
      const client = new this.ftp();
      client.on("ready", () => {
        res(new FTPConnection(client));
      });
      client.on("error", err => {
        console.log(err.code);
        rej();
      });
      client.connect(options);
    });
  }
}
