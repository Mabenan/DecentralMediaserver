import { Injectable } from "@angular/core";
import { ElectronService } from "./electron.service";
import * as fs from "fs";
import * as typeORM from "typeorm";
@Injectable({
    providedIn: "root"
})
export class TypeORMService {
    options: any;
    public connection: typeORM.Connection;
    constructor(private electron: ElectronService) {
        const lfs: typeof fs = this.electron.remote.require("fs");
        const ltypeORM: typeof typeORM = this.electron.remote.require("typeorm");
        console.log(this.electron.remote.require("electron").app.getPath("userData")+"/ormconfig.json");
        const result: string = lfs.readFileSync(this.electron.path.join(this.electron.remote.require("electron").app.getPath("userData"),"ormconfig.json"), { encoding: "UTF-8" });
        console.log(result);
        this.options = JSON.parse(result);
        this.options.entities = this.options.entities.map((value) => {
            if (typeof value === "string") {
                return this.electron.remote.require("path").join(__dirname, value.replace("dist", "../"));
            }
        });
        this.options.migrations = this.options.migrations.map((value) => {
            if (typeof value === "string") {
                return this.electron.remote.require("path").join(__dirname, value.replace("dist", "../"));
            }
        });
        if (!ltypeORM.getConnectionManager().has("default")) {
            ltypeORM.getConnectionManager().create(this.options);
        }
        this.connection = ltypeORM.getConnection("default");
    }

    public getConnection(): Promise<typeORM.Connection> {
        return new Promise<typeORM.Connection>((res, rej) => {
          if(this.connection.isConnected)
          {
            res(this.connection);
          }else{
            this.connection.connect().then((connection) => {
                this.migrate().then(() => res(this.connection)).catch(() => res(this.connection));
            }).catch((err) => {
              console.log(err);
              rej(err);
               // this.migrate().then(() => res(this.connection));
            });
          }

        });
    }


    private migrate(): Promise<any> {
        return new Promise<any>((res, rej) => {
            this.connection.runMigrations().then(() => {
                res();
            });
        });
    }
}
