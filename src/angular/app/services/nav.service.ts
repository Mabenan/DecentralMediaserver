import { EventEmitter, Injectable } from "@angular/core";
import { Event, NavigationEnd, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class NavService {
  public appDrawer: any;
  public currentUrl = new BehaviorSubject<string>(undefined);
  open: boolean;

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.next(event.urlAfterRedirects);
      }
    });
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
