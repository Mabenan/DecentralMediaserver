import { Injectable } from "@angular/core";
import { ElectronService } from './electron.service';
import * as fs from 'fs';
import * as ftp from 'ftp';
@Injectable({
    providedIn: "root"
})
export class FTPService {
    fs: typeof fs;
    ftp: typeof ftp;

    constructor(private electron: ElectronService) {
        this.fs = this.electron.remote.require("fs");
        this.ftp = this.electron.remote.require("ftp");
    }

    getListOfFiles(path: string): Promise<any[]> {
        return new Promise<any[]>((res, rej) => {
            this.connect().then((client: ftp) => {
                client.list(path, (err: Error, listing: any[]) => {
                    client.logout(() => {
                        client.destroy();

                    });
                    res(listing);
                });
            });
        });
    }

    connect(): Promise<any> {
        return new Promise<any>((res, rej) => {

            const client = new this.ftp();
            client.on("ready", () => {
                res(client);
            });
            const options: ftp.Options = JSON.parse(this.fs.readFileSync("ftp.config.json", { encoding: "UTF-8" }));
            client.connect(options);
        });
    }
}
