import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

import {AppComponent} from "./app.component";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MenuListItemComponent} from "./menu-list-item/menu-list-item.component";
import {AppRoutingModule} from "./modules/app-routing.module";
import { NavService } from "./services/nav.service";
import { TopNavComponent } from "./top-nav/top-nav.component";
import { HomeComponent } from "./home/home.component";
import { CustomizingModule } from "./customizing/customizing.module";
import { MaterialModule } from "./MaterialModule";
import { GalleryComponent } from "./gallery/gallery.component";
import {CrystalGalleryModule} from "ngx-crystal-gallery";
import { ProgressBarComponent } from "./progress-bar/progress-bar.component";

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    CustomizingModule,
    CrystalGalleryModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    MenuListItemComponent,
    HomeComponent,
    TopNavComponent,
    GalleryComponent,
    ProgressBarComponent
  ],
  entryComponents: [ProgressBarComponent],
  bootstrap: [AppComponent],
  providers: [NavService]
})
export class AppModule {}
