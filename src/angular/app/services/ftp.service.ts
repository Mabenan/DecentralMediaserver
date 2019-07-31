import { Injectable } from "@angular/core";
import { ElectronService } from './electron.service';
import * as fs from 'fs';
import * as ftp from 'ftp';
@Injectable({
    providedIn: "root"
})
export class FTPService {
    ftp: typeof ftp;
    options: ftp.Options;

    constructor(private electron: ElectronService) {
        this.ftp = this.electron.remote.require("ftp");
        const lfs: typeof fs = this.electron.remote.require("fs");
        this.options = JSON.parse(lfs.readFileSync("ftp.config.json", { encoding: "UTF-8" }));
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
            client.connect(this.options);
        });
    }
}
