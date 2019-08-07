import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CustomizingRoutingModule } from "./customizing-routing.module";
import { FileSystemListComponent } from "./file-system-list/file-system-list.component";
import { FileSystemCreationComponent } from "./file-system-creation/file-system-creation.component";
import { PathListComponent } from "./path-list/path-list.component";
import { PathCreationComponent } from "./path-creation/path-creation.component";
import { MaterialModule } from "../MaterialModule";
import { CustomizingComponent } from "./customizing/customizing.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CustomizingRoutingModule
  ],
  declarations: [
    CustomizingComponent,
    FileSystemListComponent,
    FileSystemCreationComponent,
     PathListComponent,
      PathCreationComponent]
})
export class CustomizingModule { }
