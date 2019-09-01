import { OnInit, Component, Input, OnChanges, Output, EventEmitter } from "@angular/core";
import { ImageStore } from "../services/image.service";
import { Day } from "src/types/entity/Day";
import { TypeORMService } from "../services/TypeOrm.service";
import { File } from "src/types/entity/File";

@Component({
  selector: "app-image-group",
  templateUrl: "./image-group.component.html",
  styleUrls: ["./image-group.component.scss"]

})
export class ImageGroupComponent implements OnChanges {
  @Input()
  public day: Day;
  @Output()
  imageClick: EventEmitter<File> = new EventEmitter<File>();
  @Output()
  imageDeleted: EventEmitter<File> = new EventEmitter<File>();

  public images: File[];

  constructor(public orm: TypeORMService) {}

  ngOnInit() {
  }
  delete(image: File){
    this.images = this.images.filter(img => img.id !== image.id);
    this.imageDeleted.emit(image);

  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.orm.getConnection().then(con => {
      const rep = con.getRepository<File>("File");
      rep.find({ relations:["fileSystem"], where: { day: this.day, deleted: false } }).then(files => {
        this.images = files;
      });
    });
  }
  onClick(image: File){
    this.imageClick.emit(image);
  }
}
