import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import {ServerModule} from "@angular/platform-server";

import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./modules/app-routing.module";

import { ElectronService } from "./services/electron.service";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./components/home/home.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FTPService } from "./services/ftp.service";
import { MatTableModule } from "@angular/material/table"; 
import { TypeORMService } from './services/TypeOrm.service';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [AppRoutingModule, HttpClientModule, MatTableModule,
    ServerModule, BrowserModule.withServerTransition({appId: "decentral-mediaserver"}), BrowserAnimationsModule],
  providers: [ElectronService, FTPService, TypeORMService],
  bootstrap: [AppComponent]
})
export class AppModule {}
