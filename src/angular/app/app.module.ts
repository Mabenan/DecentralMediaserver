import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import {ServerModule} from "@angular/platform-server";

import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./modules/app-routing.module";

import { ElectronService } from "./services/electron.service";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FTPService } from "./services/ftp.service";
import { MatTableModule } from "@angular/material/table";
import { TypeORMService } from "./services/TypeOrm.service";
import { FileSystemComponent } from "./file-system/file-system.component";

@NgModule({
  declarations: [AppComponent, HomeComponent, FileSystemComponent],
  imports: [AppRoutingModule, HttpClientModule, MatTableModule,
    ServerModule, BrowserModule.withServerTransition({appId: "decentral-mediaserver"}), BrowserAnimationsModule],
  providers: [ElectronService, FTPService, TypeORMService],
  bootstrap: [AppComponent]
})
export class AppModule {}
