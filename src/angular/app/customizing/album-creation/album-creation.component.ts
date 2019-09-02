import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TypeORMService } from "../../services/TypeOrm.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NavService } from "../../services/nav.service";
import { Album } from "src/types/entity/Album";

@Component({
  selector: "app-album-creation",
  templateUrl: "./album-creation.component.html",
  styleUrls: ["./album-creation.component.scss"]
})
export class AlbumCreationComponent implements OnInit {
  album: FormGroup;
  id: string;

  constructor(
    private _formBuilder: FormBuilder,
    private typeorm: TypeORMService, private route: ActivatedRoute, private navService: NavService, private router: Router) {

  }

  ngOnInit() {

    this.album = this._formBuilder.group({
      name: ["", Validators.required],
    });
  }

  save() {
    this.typeorm.getConnection().then((con) => {
      const AlbumRep = con.getRepository<Album>("Album");
        let album = new Album();
        album.name = this.album.value["name"];
        album = AlbumRep.create(album);
        AlbumRep.save(album);
        this.router.navigate(["../", {fileSystemId: this.id}], {relativeTo: this.route});
    });
  }

  abort() {
    this.router.navigate(["../", {fileSystemId: this.id}], {relativeTo: this.route});

  }

}
