import { Component, OnInit } from "@angular/core";
import * as Client from "ftp";
import { FTPService } from "../../services/ftp.service";
import { TypeORMService } from "../../services/TypeOrm.service";
import { FileSystem } from "../../../../types/entity/FileSystem";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  title = "Decentral Mediaserver App";
  folders: Client.ListingElement[] = [];
  displayedColumns: string[] = ["name"];
  fileSystems: FileSystem[] = [];
  constructor(private ftpService: FTPService, private typeorm: TypeORMService) { }

  ngOnInit() {
    this.ftpService.getListOfFiles("").then((res) => {
      this.folders = res;
    });
    this.typeorm.connection.getRepository<FileSystem>("FileSystem").find().then((systems) => {
      this.fileSystems = systems;
    });
  }
}
