import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ProgressService {

  public mode: "determinate" | "indeterminate" | "buffer" | "query";
  public value: number;
  app: any;
  popup: any;

  constructor() {
  }

  public registerApp(app: any) {
    this.app = app;
  }

  public registerPopup(popup: any) {
    this.popup = popup;
  }

  public activate() {
    this.value = 0;
    this.app.showProgress();
  }

  public close() {
    this.popup.dialogRef.close();
  }
}
