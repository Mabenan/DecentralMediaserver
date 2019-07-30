import { Component } from "@angular/core";
import { ElectronService } from "./services/electron.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  public isActive = false;
  constructor(private electronService: ElectronService) {
    return;
  }
  ToogleSidebar(){
    this.isActive = !this.isActive;
  }
}
