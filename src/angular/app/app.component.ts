import {
  Component,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  AfterViewInit
} from "@angular/core";
import { VERSION, MatDialog } from "@angular/material";
import { NavService } from "./services/nav.service";
import { NavItem } from "./nav-item";
import { TypeORMService } from "./services/TypeOrm.service";
import { FileSystem } from "src/types/entity/FileSystem";
import { ProgressBarComponent } from "./progress-bar/progress-bar.component";
import { ProgressService } from "./services/progress.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
  @ViewChild("appDrawer") appDrawer: ElementRef;
  version = VERSION;
  constructor(public navService: NavService, private typeoORM: TypeORMService, public dialog: MatDialog, public progessService: ProgressService) {
    this.progessService.registerApp(this);
  }


  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }
  showProgress() {
    const dialogRef = this.dialog.open(ProgressBarComponent, {
      width: "100%",
      disableClose: true,
      hasBackdrop: true
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
