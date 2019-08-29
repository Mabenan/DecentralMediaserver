import { Component, OnInit } from "@angular/core";
import { TypeORMService } from "../services/TypeOrm.service";
import { File } from "src/types/entity/File";
import * as $ from "jquery";
import { IntersectionState } from "ng-lazy-load";
import { ImageStore } from "../services/image.service";
import { Day } from 'src/types/entity/Day';
declare var lightGallery: any;
@Component({
  selector: "app-gallery",
  templateUrl: "./gallery.component.html",
  styleUrls: ["./gallery.component.scss"]
})
export class GalleryComponent implements OnInit {
  days: any;

  constructor(private orm: TypeORMService) {}

  ngOnInit() {

    this.orm.getConnection().then(conn => {
      conn
        .getRepository<Day>("Day")
        .find({ relations: ["images"]
        //skip: start, take:count
      })
        .then(files => {
          this.days = files;
           //this.loadimages(start+count, count);
        });
    });
  }


}
