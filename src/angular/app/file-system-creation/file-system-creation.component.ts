import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TypeORMService } from "../services/TypeOrm.service";
import { FileSystem } from "src/types/entity/FileSystem";

@Component({
  selector: "app-file-system-creation",
  templateUrl: "./file-system-creation.component.html",
  styleUrls: ["./file-system-creation.component.scss"]
})
export class FileSystemCreationComponent implements OnInit {

  basicSystemData: FormGroup;
  ftpSettings: FormGroup; constructor(private _formBuilder: FormBuilder, private typeORM: TypeORMService) {}

  ngOnInit() {
    this.basicSystemData = this._formBuilder.group({
      fileSystemName: ["", Validators.required],
      fileSystemType: ["", Validators.required]
    });
    this.ftpSettings = this._formBuilder.group({
      host: ["", Validators.required],
      user: ["", Validators.required],
      pass: ["", Validators.required]
    });
  }

  finish() {
    this.typeORM.getConnection().then((conn) => {
      const rep  = conn.getRepository<FileSystem>("FileSystem");
      let fileSystem = new FileSystem();
      fileSystem.path = "./";
      fileSystem.description = "";
      fileSystem.title = this.basicSystemData.value["fileSystemName"];
      fileSystem.type = this.basicSystemData.value["fileSystemType"];
      fileSystem.host = this.ftpSettings.value["host"];
      fileSystem.user = this.ftpSettings.value["user"];
      fileSystem.pass = this.ftpSettings.value["pass"];
      fileSystem = rep.create(fileSystem);
      rep.save(fileSystem);
    });
  }

}
