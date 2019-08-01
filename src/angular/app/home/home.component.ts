import { Component, OnInit } from "@angular/core";
import * as Client from "ftp";
import { FTPService } from "../services/ftp.service";
import { TypeORMService } from "../services/TypeOrm.service";
import { FileSystem } from "../../../types/entity/FileSystem";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  ngOnInit(): void {
  }
}
