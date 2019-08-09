import { Component, OnInit } from "@angular/core";
import { FileSystem } from "src/types/entity/FileSystem";
import { FTPService } from "../../services/ftp.service";
import { TypeORMService } from "../../services/TypeOrm.service";
import * as Client from "basic-ftp";
import { NavService, ToolbarHandler } from "../../services/nav.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ImageSearchService } from "../../services/ImageSearch.service";

@Component({
  selector: "app-file-system-list",
  templateUrl: "./file-system-list.component.html",
  styleUrls: ["./file-system-list.component.scss"]
})
export class FileSystemListComponent implements OnInit, ToolbarHandler {
  title = "Decentral Mediaserver App";
  folders: Client.FileInfo[] = [];
  displayedColumns: string[] = ["name", "type", "actions"];
  fileSystems: FileSystem[] = [];
  constructor(
    private ftpService: FTPService,
    private typeorm: TypeORMService,
    private navService: NavService,
    private router: Router,
    private route: ActivatedRoute,
    private imageSearchService: ImageSearchService
  ) {
        this.navService.addToolbarButtons(FileSystemListComponent.prototype.constructor.name, [{name: "Create New File System", handler: this, icon: ""}]);
  }

  ngOnInit() {
    this.typeorm.getConnection().then(connection =>
      connection
        .getRepository<FileSystem>("FileSystem")
        .find({relations: ["pathMaps"]})
        .then(systems => {
          this.fileSystems = systems;
        })
    );
  }
  onClick() {
    this.router.navigate(["../creation"], {relativeTo: this.route});
  }

  imageSearch(element: FileSystem) {
    this.imageSearchService.searchFor(element);
  }
  thumbCreation(element: FileSystem) {
    this.imageSearchService.thumbNail(element);
  }
  paths(element: FileSystem) {
    this.router.navigate(["../../paths", element.id], {relativeTo: this.route});
  }
}
