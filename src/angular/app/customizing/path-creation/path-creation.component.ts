import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TypeORMService } from "../../services/TypeOrm.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NavService } from "../../services/nav.service";
import { FileSystem } from "src/types/entity/FileSystem";
import { PathMap } from "src/types/entity/PathMap";

@Component({
  selector: "app-path-creation",
  templateUrl: "./path-creation.component.html",
  styleUrls: ["./path-creation.component.scss"]
})
export class PathCreationComponent implements OnInit {
  path: FormGroup;
  id: string;

  constructor(
    private _formBuilder: FormBuilder,
    private typeorm: TypeORMService, private route: ActivatedRoute, private navService: NavService, private router: Router) {

  }

  ngOnInit() {

    this.path = this._formBuilder.group({
      ftp: ["", Validators.required],
      web: ["", Validators.required]
    });
    this.route.paramMap.subscribe((params) => {
      this.id = params.get("fileSystemId");
    });
  }

  save() {
    this.typeorm.getConnection().then((con) => {
      const fileSystemRep = con.getRepository<FileSystem>("FileSystem");
      const pathRep = con.getRepository<PathMap>("PathMap");
      fileSystemRep.findOne(this.id).then((fileSytem) => {
        let path = new PathMap();
        path.ftpPath = this.path.value["ftp"];
        path.webPath = this.path.value["web"];
        path.fileSystem = fileSytem;
        path = pathRep.create(path);
        pathRep.save(path);
        this.router.navigate(["../", {fileSystemId: this.id}], {relativeTo: this.route});
      });
    });
  }

  abort() {
    this.router.navigate(["../", {fileSystemId: this.id}], {relativeTo: this.route});

  }

}
