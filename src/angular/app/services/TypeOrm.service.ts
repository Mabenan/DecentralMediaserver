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
        this.options = JSON.parse(lfs.readFileSync("ormconfig.json", { encoding: "UTF-8" }));
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
        this.connection.connect().then((connection) => connection.synchronize()).catch(() => {
            this.connection.synchronize();
        });
    }

}
