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
import { Day } from "src/types/entity/Day";
import { TypeORMService } from "../services/TypeOrm.service";
import { File } from "src/types/entity/File";
import { Album } from "src/types/entity/Album";
import { MatCheckbox, MatDialog } from "@angular/material";
import { ImageEditComponent } from "../image-edit/image-edit.component";

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
  @Output()
  imageChanged: EventEmitter<File> = new EventEmitter<File>();

  @ViewChildren(MatCheckbox) checkboxes = new QueryList<MatCheckbox>();

  public images: File[];
  allToogled: boolean;

  constructor(public orm: TypeORMService, public dialog: MatDialog) {}

  ngOnInit() {}
  onSelected(image: File) {
    this.imageSelected.emit(image);
  }

  checkAll() {
    this.allToogled = !this.allToogled;
    this.checkboxes.forEach(ck => {
      if (ck.checked !== this.allToogled) {
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
            relations: ["fileSystem", "day"],
            where: { day: this.day, deleted: false }
          })
          .then(files => {
            this.images = files;
          });
      } else {
        rep
          .find({
            relations: ["fileSystem", "day"],
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
  onEdit(image: File) {
    const limage = image;
    const dialogRef = this.dialog.open(ImageEditComponent, {
      width: "100%",
      disableClose: true,
      hasBackdrop: true,
      data: { image: limage }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orm.getConnection().then(con => {
          const rep = con.getRepository<File>("File");
          const today = limage.createdAt;
          const date =
            today.getFullYear() +
            "-" +
            ("0" + (today.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + today.getDate()).slice(-2);
          con
            .getRepository<Day>("Day")
            .findOneOrFail(date)
            .then(day => {
              limage.day = day;
              rep.save(limage).then(img => this.imageChanged.emit(img));
            })
            .catch(() => {
              const day = new Day();
              day.day = date;
              con
                .getRepository<Day>("Day")
                .save(day)
                .then(lday => {
                  limage.day = lday;
                  rep.save(limage).then(img => this.imageChanged.emit(img));
                });
            });
        });
      }
    });
  }
}
