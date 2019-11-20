import { Component, OnInit, ApplicationRef, HostListener } from "@angular/core";
import { TypeORMService } from "../services/TypeOrm.service";
import { File } from "src/types/entity/File";
import * as $ from "jquery";
import { IntersectionState } from "ng-lazy-load";
import { ImageStore } from "../services/image.service";
import { Day } from "src/types/entity/Day";
import { PageEvent } from "@angular/material";
import { Observable, BehaviorSubject } from "rxjs";
import { List } from "immutable";
import { Album } from "src/types/entity/Album";
import { Repository } from "typeorm";
import { ActivatedRoute } from "@angular/router";
import { FTPService } from "../services/ftp.service";
import * as streamBuffers from "stream-buffers";
import async = require("async");
import { ProgressService } from "../services/progress.service";
import { ElectronService } from "../services/electron.service";
export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}
@Component({
  selector: "app-gallery",
  templateUrl: "./gallery.component.html",
  styleUrls: ["./gallery.component.scss"]
})
export class GalleryComponent implements OnInit {
  length = 100;
  pageSize = 5;
  pageSizeOptions: number[] = [1, 3, 5, 10];
  days: Day[];
  albums: Album[];
  order: "ASC" | "DESC"  = "ASC";
  public album: Album;
  public selectedAlbum: string;
  selectedImages: File[] = [];
  private _currentDays: BehaviorSubject<List<Day>> = new BehaviorSubject(
    List([])
  );

  public readonly currentDays: Observable<
    List<Day>
  > = this._currentDays.asObservable();
  imageCount: number;
  images: File[];
  currentBigImage: File;
  currentIndex: number;
  fileRep: Repository<File>;
  massSelectedAlbum: string;
  parameter: any;

  constructor(
    private orm: TypeORMService,
    private activeRoute: ActivatedRoute,
    private app: ApplicationRef,
    private ftp: FTPService,
    private progress: ProgressService,
    private electron: ElectronService
  ) {}

  downloadAlbum() {
    this.progress.activate();
    this.progress.mode = "determinate";
    this.electron.remote.dialog
      .showOpenDialog({ properties: ["openDirectory"] })
      .then(dialogRet => {
        const onePercent = (1 / this.images.length) * 100;
        async.eachLimit(this.images, 3, async (file, callback) => {
          this.ftp
            .connect({
              host: file.fileSystem.ftpHost,
              user: file.fileSystem.ftpUser,
              password: file.fileSystem.ftpPass
            })
            .then(ftpcon => {
              ftpcon
                .getFile("/" + file.ftpPath)
                .then((stream: streamBuffers.WritableStreamBuffer) => {
                  let bufs = stream.getContents();
                  this.electron.fs.writeFileSync(
                    this.electron.path.join(dialogRet.filePaths[0], file.name),
                    bufs
                  );

                  this.progress.message = file.name;
                  this.progress.value += onePercent;
                  bufs = undefined;
                  ftpcon.logout();
                  callback();
                })
                .catch(err => {
                  ftpcon.logout();
                  console.log(err);
                  callback();
                });
            })
            .catch(err => {
              console.log(err);
              callback();
            });
        }, () => {
          this.progress.close();
        });
      });
  }

  changeOrder(){
    this.order = this.order === 'ASC'  ? 'DESC' : 'ASC';
    this.refresh(this.parameter);
  }

  onClick(image: File) {
    this.currentBigImage = image;
    this.currentIndex = this.images.findIndex(img => img.id === image.id);
    this.selectedAlbum = this.currentBigImage.album
      ? this.currentBigImage.album.id
      : null;
  }
  @HostListener("window:keyup", ["$event"])
  keyEvent(event: KeyboardEvent) {
    if (this.currentBigImage === undefined) {
      return;
    }

    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.nextImage(this.currentBigImage);
    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.previouseImage(this.currentBigImage);
    }
  }

  onImageChanged(image: File){
    this.refresh(this.parameter);

  }

  previouseImage(image: File) {
    let imageIndex = -1;
    if (this.currentIndex !== undefined) {
      imageIndex = this.currentIndex - 1;
    } else {
      imageIndex = this.images.findIndex(img => img.id === image.id) - 1;
    }
    if (imageIndex >= 0) {
      this.currentIndex = imageIndex;
      this.currentBigImage = this.images[imageIndex];
      this.selectedAlbum = this.currentBigImage.album
        ? this.currentBigImage.album.id
        : null;
    }
  }
  nextImage(image: File) {
    let imageIndex = -1;
    if (this.currentIndex !== undefined) {
      imageIndex = this.currentIndex + 1;
    } else {
      imageIndex = this.images.findIndex(img => img.id === image.id) + 1;
    }
    if (imageIndex < this.imageCount - 1) {
      this.currentIndex = imageIndex;
      this.currentBigImage = this.images[imageIndex];
      this.selectedAlbum = this.currentBigImage.album
        ? this.currentBigImage.album.id
        : null;
    }
  }

  close() {
    this.currentBigImage = undefined;
    this.currentIndex = undefined;
    this.selectedAlbum = undefined;
  }

  async onDelete(image: File): Promise<any> {
    return new Promise<any>((res, rej) => {
      this.images = this.images.filter(val => val.id !== image.id);
      this.orm.getConnection().then(conn => {
        image.deleted = true;
        conn.getRepository<File>("File").save(image);
        res();
      });
    });
  }

  massDelete() {
    this.orm.getConnection().then(conn => {
      this.selectedImages.forEach(img => {
        img.deleted = true;
      });
      conn.getRepository<File>("File").save(this.selectedImages);
      this.selectedImages = [];
      const list = this._currentDays.value;
      this._currentDays.next(List());
      this.app.tick();
      this._currentDays.next(list);
    });
  }
  massAddToAlbum() {
    this.orm.getConnection().then(conn => {
      conn
        .getRepository<Album>("Album")
        .findOne(this.massSelectedAlbum, { relations: ["files"] })
        .then(alb => {
          this.selectedImages.forEach(img => {
            img.album = alb;
          });
          this.fileRep.save(this.selectedImages);
          this.selectedImages = [];
          const list = this._currentDays.value;
          this._currentDays.next(List());
          this.app.tick();
          this._currentDays.next(list);
        });
    });
  }

  async onSelect(image: File): Promise<any> {
    return new Promise<any>((res, rej) => {
      const index = this.selectedImages.findIndex(val => val.id === image.id);
      if (index === -1) {
        this.selectedImages.push(image);
      } else {
        this.selectedImages = this.selectedImages.filter(
          val => val.id !== image.id
        );
      }
      res();
    });
  }

  delete() {
    const imageToSave = this.currentBigImage;
    this.images = this.images.filter(val => val.id !== this.currentBigImage.id);
    this.imageCount = this.images.length;
    if (this.currentIndex >= this.imageCount) {
      this.currentIndex = this.currentIndex - 1;
    }
    this.currentBigImage = this.images[this.currentIndex];
    this.selectedAlbum = this.currentBigImage.album
      ? this.currentBigImage.album.id
      : null;
    this.orm.getConnection().then(conn => {
      imageToSave.deleted = true;
      conn.getRepository<File>("File").save(imageToSave);
    });
  }

  addToAlbum() {
    const imageToSave = this.currentBigImage;
    this.orm.getConnection().then(conn => {
      conn
        .getRepository<Album>("Album")
        .findOne(this.selectedAlbum, { relations: ["files"] })
        .then(alb => {
          imageToSave.album = alb;
          this.fileRep.save(imageToSave);
        });
    });
  }

  ngOnInit() {
    this.activeRoute.paramMap.subscribe(value => {
      this.parameter = value;
      this.refresh(this.parameter);
    });
  }
  private refresh(value) {
    this.progress.message = "loading images ..."
    this.progress.mode = "indeterminate";
    this.progress.activate();
    this.selectedImages = [];
    this.orm.getConnection().then(conn => {
      conn
        .getRepository<Album>("Album")
        .find()
        .then(albums0 => {
          this.albums = albums0;
          this.massSelectedAlbum =
            this.albums.length > 0 ? this.albums[0].id : "";
        });
      this.fileRep = conn.getRepository<File>("File");
      if (!value.has("albumId")) {
        this.fileRep
          .find({
            where: { deleted: false },
            order: { createdAt: this.order },
            relations: ["fileSystem", "album"]
          })
          .then(images => {
            this.imageCount = images.length;
            this.images = images;
          });
        /**conn
          .getRepository<Day>("Day")
          .find()
          .then(files => {
            this._currentDays.next(List(files.slice(0, this.pageSize)));
            this.days = files;
            this.length = files.length;
            //this.loadimages(start+count, count);
          });**/
        conn.createQueryBuilder<Day>("Day", "Day").where("day in (SELECT dayDay from file where dayDay = day and deleted = false)").orderBy("day",this.order).getMany().then(files => {
          this._currentDays.next(List(files.slice(0, this.pageSize)));
          this.days = files;
          this.length = files.length;
          this.progress.close();
          //this.loadimages(start+count, count);
        });;
      }
      else {
        conn
          .getRepository<Album>("Album")
          .findOne(value.get("albumId"))
          .then(album => {
            this.album = album;
            this.fileRep
              .find({
                where: { deleted: false, album: this.album },
                order: { createdAt: this.order },
                relations: ["fileSystem", "album", "day"]
              })
              .then(images => {
                this.imageCount = images.length;
                this.images = images;
                const days: Day[] = [];
                this.images.forEach(img => {
                  if (days.findIndex(day => day.day === img.day.day) === -1) {
                    days.push(img.day);
                  }
                });
                this._currentDays.next(List(days.slice(0, this.pageSize)));
                this.days = days;
                this.length = days.length;
              });
          });
      }
    });
  }

  onPage(event: PageEvent) {
    this.selectedImages = [];
    this._currentDays.next(
      List(
        this.days.slice(
          event.pageIndex * event.pageSize,
          event.pageIndex * event.pageSize + event.pageSize
        )
      )
    );
  }
}
