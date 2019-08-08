import {
  Component,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  AfterViewInit
} from "@angular/core";
import { VERSION } from "@angular/material";
import { NavService } from "./services/nav.service";
import { NavItem } from "./nav-item";
import { TypeORMService } from "./services/TypeOrm.service";
import { FileSystem } from "src/types/entity/FileSystem";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
  @ViewChild("appDrawer") appDrawer: ElementRef;
  version = VERSION;
  constructor(public navService: NavService, private typeoORM: TypeORMService) {}

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }
}
