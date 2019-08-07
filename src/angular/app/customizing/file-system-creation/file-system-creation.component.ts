import { Component, OnInit, ViewChildren, QueryList } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TypeORMService } from "../../services/TypeOrm.service";
import { FileSystem } from "src/types/entity/FileSystem";
import { NavService, ToolbarHandler } from "../../services/nav.service";
import { MatStepper } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-file-system-creation",
  templateUrl: "./file-system-creation.component.html",
  styleUrls: ["./file-system-creation.component.scss"]
})
export class FileSystemCreationComponent implements OnInit, ToolbarHandler {
  @ViewChildren(MatStepper) stepper: QueryList<MatStepper>;
  basicSystemData: FormGroup;
  ftpSettings: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    private typeORM: TypeORMService,
    private navService: NavService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.navService.addToolbarButtons(
      FileSystemCreationComponent.prototype.constructor.name,
      [{ name: "Close", handler: this, icon: "" }]
    );
  }

  ngOnInit() {
    this.basicSystemData = this._formBuilder.group({
      fileSystemName: ["", Validators.required],
      fileSystemType: ["", Validators.required]
    });
    this.ftpSettings = this._formBuilder.group({
      host: ["", Validators.required],
      user: ["", Validators.required],
      pass: ["", Validators.required],
      webHost: ["", Validators.required]
    });
  }
  onClick() {
    this.stepper.forEach(st => st.reset());
    this.router.navigate([ "../"], {relativeTo: this.route});
  }

  finish() {
    this.typeORM.getConnection().then(conn => {
      const rep = conn.getRepository<FileSystem>("FileSystem");
      let fileSystem = new FileSystem();
      fileSystem.title = this.basicSystemData.value["fileSystemName"];
      fileSystem.type = this.basicSystemData.value["fileSystemType"];
      fileSystem.ftpHost = this.ftpSettings.value["host"];
      fileSystem.ftpUser = this.ftpSettings.value["user"];
      fileSystem.ftpPass = this.ftpSettings.value["pass"];
      fileSystem.webHost = this.ftpSettings.value["webHost"];
      fileSystem = rep.create(fileSystem);
      rep.save(fileSystem);
    });
  }
}
