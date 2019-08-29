import { Component, OnInit } from "@angular/core";
import { TypeORMService } from "../services/TypeOrm.service";
import { File } from "src/types/entity/File";
import * as $ from "jquery";
import { IntersectionState } from "ng-lazy-load";
import { ImageStore } from "../services/image.service";
declare var lightGallery: any;
@Component({
  selector: "app-gallery",
  templateUrl: "./gallery.component.html",
  styleUrls: ["./gallery.component.scss"]
})
export class GalleryComponent implements OnInit {

  constructor(public imageStore: ImageStore) {}

  ngOnInit() {
  }


}
