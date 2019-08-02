import { Component, OnInit } from "@angular/core";
import { FileSystem } from "src/types/entity/FileSystem";
import { FTPService } from "../services/ftp.service";
import { TypeORMService } from "../services/TypeOrm.service";
import * as Client from "ftp";
import { NavService, ToolbarHandler } from "../services/nav.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-file-system",
  templateUrl: "./file-system.component.html",
  styleUrls: ["./file-system.component.scss"]
})
export class FileSystemComponent implements OnInit, ToolbarHandler {
  title = "Decentral Mediaserver App";
  folders: Client.ListingElement[] = [];
  displayedColumns: string[] = ["name", "path"];
  fileSystems: FileSystem[] = [];
  constructor(
    private ftpService: FTPService,
    private typeorm: TypeORMService,
    private navService: NavService,
    private route: ActivatedRoute
  ) {
        this.navService.addToolbarButtons(FileSystemComponent.prototype.constructor.name,[{name: "test", handler: this, icon: ""}]);
  }

  ngOnInit() {
    this.typeorm.getConnection().then(connection =>
      connection
        .getRepository<FileSystem>("FileSystem")
        .find()
        .then(systems => {
          this.fileSystems = systems;
        })
    );
  }
  onClick() {
    throw new Error("Method not implemented.");
  }
}
