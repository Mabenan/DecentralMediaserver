import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ProgressBarComponent } from "../progress-bar/progress-bar.component";

@Component({
  selector: "app-image-edit",
  templateUrl: "./image-edit.component.html",
  styleUrls: ["./image-edit.component.scss"]
})
export class ImageEditComponent implements OnInit {

  public createdAt: Date;

  constructor(public dialogRef: MatDialogRef<ProgressBarComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.createdAt = this.data.image.createdAt;
   }

  ngOnInit() {
  }

}
