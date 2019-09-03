import { EventEmitter, Injectable, OnChanges, Component } from "@angular/core";
import { Event, NavigationEnd, Router, ActivatedRoute } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { element } from "@angular/core/src/render3";
import { Tree } from "@angular/router/src/utils/tree";
import { NavItem } from "../nav-item";
import { TypeORMService } from "./TypeOrm.service";
import { Album } from "src/types/entity/Album";

export interface ToolbarHandler {
  onClick();
}

export interface ToolbarButton {
  name: string;
  handler: ToolbarHandler;
  icon: string;
}

@Injectable()
export class NavService {
  public appDrawer: any;
  public currentUrl = new BehaviorSubject<string>(undefined);
  public registeredToolbarButtons: Map<string, ToolbarButton[]> = new Map<
    string,
    ToolbarButton[]
  >();
  public toolbarButtons: ToolbarButton[];
  open: boolean;
  public navItems: NavItem[] = [
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
          route: "customizing/"
        },
        {
          displayName: "Album",
          iconName: "recent_actors",
          route: "customizing/album"
        },
      ]
    },
    {
      displayName: "Gallery",
      iconName: "recent_actors",
      route: "gallery",
      children: []
    },
  ];

  constructor(private router: Router, private orm: TypeORMService) {
    this.orm.getConnection().then((conn) => {
      conn.getRepository<Album>("Album").find().then((albs) => {
        const albumNav = {
          displayName: "Alben",
          iconName: "recent_actors",
          route: "",
          children: []
        };
        albs.forEach(alb => {
          albumNav.children.push({displayName: alb.name,
            iconName: "recent_actors",
            route: "gallery/" + alb.id, });
        });
        this.navItems.push(albumNav);
      });
    });
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.next(event.urlAfterRedirects);
        const names: string[] = this.collectNames(
          this.router.routerState.root.root
        );
        this.toolbarButtons = [];
        names.forEach(name => {
          if (this.registeredToolbarButtons.has(name)) {
            this.toolbarButtons = this.toolbarButtons.concat(
              this.registeredToolbarButtons.get(name)
            );
          }
        });
      }
    });
  }
  addToolbarButtons(key: string, values: ToolbarButton[]) {
    this.registeredToolbarButtons.set(key, values);
  }
  collectNames(root: ActivatedRoute): string[] {
    let names = [];
    if (root.component !== undefined) {
      names = [(root.component as any).name];
    }
    root.children.forEach(child => {
      names = names.concat(this.collectNames(child));
    });
    return names;
  }

  public toogleNav() {
    if (this.open) {
      this.appDrawer.close();
    } else {
      this.appDrawer.open();
    }
    this.open = !this.open;
  }
}
