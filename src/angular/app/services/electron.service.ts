import { Injectable } from "@angular/core";

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from "electron";
import * as childProcess from "child_process";
import * as fs from "fs";
import * as path from "path";

@Injectable({
  providedIn: "root"
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  path: typeof path;
  app: any;

  get isElectron() {
    return window && (<any>window).process && (<any>window).process.type;
  }

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = (<any>window).require("electron").ipcRenderer;
      this.webFrame = (<any>window).require("electron").webFrame;
      this.remote = (<any>window).require("electron").remote;
      this.app = (<any>window).require("electron");

      this.childProcess = (<any>window).require("child_process");
      this.fs = (<any>window).require("fs");
      this.path = (<any>window).require("path");
    }
  }
}
