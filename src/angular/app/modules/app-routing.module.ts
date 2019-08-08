import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "../home/home.component";
import { GalleryComponent } from "../gallery/gallery.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "customizing",
    loadChildren: () => import("../customizing/customizing.module").then(mod => mod.CustomizingModule),
  },
  {
    path: "gallery",
    component: GalleryComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
