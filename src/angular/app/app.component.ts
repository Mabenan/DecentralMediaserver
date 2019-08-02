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

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
  @ViewChild("appDrawer") appDrawer: ElementRef;
  version = VERSION;
  navItems: NavItem[] = [
    {
      displayName: "Home",
      iconName: "recent_actors",
      route: "",
      children: []
    },
    {
      displayName: "Customizing",
      iconName: "recent_actors",
      route: "",
      children: [
        {
          displayName: "FileSystem",
          iconName: "recent_actors",
          route: "customizing/file-system"
        }
      ]
    }
  ];
  constructor(public navService: NavService) {}

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }
}
