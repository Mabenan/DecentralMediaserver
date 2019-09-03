import {
  OnInit,
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList
} from "@angular/core";
import { ImageStore } from "../services/image.service";
import { Day } from "src/types/entity/Day";
import { TypeORMService } from "../services/TypeOrm.service";
import { File } from "src/types/entity/File";
import { Album } from "src/types/entity/Album";
import { MatCheckbox } from '@angular/material';

@Component({
  selector: "app-image-group",
  templateUrl: "./image-group.component.html",
  styleUrls: ["./image-group.component.scss"]
})
export class ImageGroupComponent implements OnChanges {
  @Input()
  public day: Day;
  @Input()
  public album: Album;
  @Output()
  imageClick: EventEmitter<File> = new EventEmitter<File>();
  @Output()
  imageSelected: EventEmitter<File> = new EventEmitter<File>();

  @ViewChildren(MatCheckbox) checkboxes = new QueryList<MatCheckbox>();

  public images: File[];
  allToogled: boolean;

  constructor(public orm: TypeORMService) {}

  ngOnInit() {}
  onSelected(image: File){
    this.imageSelected.emit(image);
  }

  checkAll(){
    this.allToogled = !this.allToogled;
    this.checkboxes.forEach(ck =>{
      if(ck.checked !== this.allToogled){
        //ck.toggle();
        ck._onInputClick(new Event("click"));
      }
    });
  }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.orm.getConnection().then(con => {
      const rep = con.getRepository<File>("File");
      if (this.album === undefined) {
        rep
          .find({
            relations: ["fileSystem"],
            where: { day: this.day, deleted: false }
          })
          .then(files => {
            this.images = files;
          });
      } else {
        rep
          .find({
            relations: ["fileSystem"],
            where: { day: this.day, album: this.album, deleted: false }
          })
          .then(files => {
            this.images = files;
          });
      }
    });
  }
  onClick(image: File) {
    this.imageClick.emit(image);
  }
}
