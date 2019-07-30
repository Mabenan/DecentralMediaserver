import { Component, OnInit } from "@angular/core";
import * as Client from 'ftp';
import { FTPService } from 'src/app/services/ftp.service';
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  title = "Decentral Mediaserver App";
  folders: Client.ListingElement[] = [];
  displayedColumns: string[] = ["name"];
  constructor(private ftpService: FTPService) { }

  ngOnInit() {
    this.ftpService.getListOfFiles("").then((res) => {
      this.folders = res;
    });
  }
}
