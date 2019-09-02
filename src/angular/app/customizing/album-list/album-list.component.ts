import { Component, OnInit } from "@angular/core";
import { PathMap } from "src/types/entity/PathMap";
import { ActivatedRoute, Router } from "@angular/router";
import { TypeORMService } from "../../services/TypeOrm.service";
import { FileSystem } from "src/types/entity/FileSystem";
import { NavService, ToolbarHandler } from "../../services/nav.service";
import { Album } from "src/types/entity/Album";

@Component({
  selector: "app-album-list",
  templateUrl: "./album-list.component.html",
  styleUrls: ["./album-list.component.scss"]
})
export class AlbumListComponent implements OnInit, ToolbarHandler {
  displayedColumns: string[] = ["name"];
  albums: Album[] = [];
  fileSystemId: string;

  constructor(private typeorm: TypeORMService, private route: ActivatedRoute, private navService: NavService, private router: Router) {
    this.navService.addToolbarButtons(AlbumListComponent.prototype.constructor.name, [{name: "Create New Album Map", handler: this, icon: ""}]);


  }
  onClick() {

    this.router.navigate(["../../album/creation"], {relativeTo: this.route});

  }

  ngOnInit() {
      this.typeorm.getConnection().then((conn) => {
        const rep = conn.getRepository<Album>("Album");
        rep.find().then((albs) => this.albums = albs);
      });
  }
}
