import { Component, OnInit } from "@angular/core";
import { TypeORMService } from "../services/TypeOrm.service";
import { File } from "src/types/entity/File";
import { IMasonryGalleryImage } from "ngx-masonry-gallery";

@Component({
  selector: "app-gallery",
  templateUrl: "./gallery.component.html",
  styleUrls: ["./gallery.component.scss"]
})
export class GalleryComponent implements OnInit {
  images: any[] = [];

  myconfig =  {
    masonry: true,
    masonryMaxHeight: 50
  };

  constructor(private orm: TypeORMService) {}

  ngOnInit() {
    this.orm.getConnection().then(conn => {
      conn
        .getRepository<File>("File")
        .find({relations: ["fileSystem"]})
        .then(files => {
          this.images = files.map(val => {
            const path = "http://" + val.fileSystem.webHost + "/" + encodeURI(val.webPath);
            return { preview: "data:image/jpeg;base64,"+val.thumb, full: path, width: 1469, height: 675, description: val.name };
          }) as any[];
        });
    });
  }
}
