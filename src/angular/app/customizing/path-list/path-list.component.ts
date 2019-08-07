import { Component, OnInit } from "@angular/core";
import { PathMap } from "src/types/entity/PathMap";
import { ActivatedRoute, Router } from "@angular/router";
import { TypeORMService } from "../../services/TypeOrm.service";
import { FileSystem } from "src/types/entity/FileSystem";
import { NavService, ToolbarHandler } from "../../services/nav.service";

@Component({
  selector: "app-path-list",
  templateUrl: "./path-list.component.html",
  styleUrls: ["./path-list.component.scss"]
})
export class PathListComponent implements OnInit, ToolbarHandler {
  displayedColumns: string[] = ["ftpPath", "webPath"];
  paths: PathMap[] = [];
  fileSystemId: string;

  constructor(private typeorm: TypeORMService, private route: ActivatedRoute, private navService: NavService, private router: Router) {
    this.navService.addToolbarButtons(PathListComponent.prototype.constructor.name, [{name: "Create New Path Map", handler: this, icon: ""}]);


  }
  onClick() {

    this.router.navigate(["../../paths/creation", {fileSystemId: this.fileSystemId}], {relativeTo: this.route});

  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.fileSystemId = params.get("fileSystemId");
      this.typeorm.getConnection().then((conn) => {
        const rep = conn.getRepository<FileSystem>("FileSystem");
        rep.findOne(this.fileSystemId, {relations: ["pathMaps"]}).then((fileSystem) => {
          this.paths = fileSystem.pathMaps;
        });
      });
    });
  }
}
