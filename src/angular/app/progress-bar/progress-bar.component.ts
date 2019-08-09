import { Component, OnInit } from "@angular/core";
import { ProgressService } from "../services/progress.service";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: "app-progress-bar",
  templateUrl: "./progress-bar.component.html",
  styleUrls: ["./progress-bar.component.scss"]
})
export class ProgressBarComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ProgressBarComponent>, public progressService: ProgressService) { this.progressService.registerPopup(this); }

  ngOnInit() {
  }

}
