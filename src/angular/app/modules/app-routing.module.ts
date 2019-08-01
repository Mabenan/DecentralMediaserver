import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "../home/home.component";
import { FileSystemComponent } from "../file-system/file-system.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "customizing/file-system",
    component: FileSystemComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
