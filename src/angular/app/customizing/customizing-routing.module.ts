import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FileSystemListComponent } from "../customizing/file-system-list/file-system-list.component";
import { FileSystemCreationComponent } from "../customizing/file-system-creation/file-system-creation.component";
import { PathListComponent } from "../customizing/path-list/path-list.component";
import { PathCreationComponent } from "../customizing/path-creation/path-creation.component";
import { CustomizingComponent } from "./customizing/customizing.component";
import { AlbumCreationComponent } from "./album-creation/album-creation.component";
import { AlbumListComponent } from "./album-list/album-list.component";

const routes: Routes = [
  {
    path: "",
    component: CustomizingComponent,
    children: [
      {
        path: "file-system",
        children: [
          {
            path: "list",
            component: FileSystemListComponent
          },
          {
            path: "creation",
            component: FileSystemCreationComponent
          },
          {
            path: "",
            redirectTo: "list",
            pathMatch: "full"
          }
        ]
      },
      {
        path: "album",
        children: [
          {
            path: "list",
            component: AlbumListComponent
          },
          {
            path: "creation",
            component: AlbumCreationComponent
          },
          {
            path: "",
            redirectTo: "list",
            pathMatch: "full"
          }
        ]
      },
      {
        path: "paths/:fileSystemId",
        children: [
          {
            path: "list",
            component: PathListComponent
          },
          {
            path: "creation",
            component: PathCreationComponent
          },
          {
            path: "",
            redirectTo: "list",
            pathMatch: "full"
          }
        ]
      },
      {
        path: "",
        redirectTo: "file-system",
        pathMatch: "full"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomizingRoutingModule {}
