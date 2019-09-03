import { Component, OnInit, ApplicationRef } from "@angular/core";
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
declare var lightGallery: any;
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

  constructor(
    private orm: TypeORMService,
    private activeRoute: ActivatedRoute,
    private app: ApplicationRef
  ) {}

  onClick(image: File) {
    this.currentBigImage = image;
    this.currentIndex = this.images.findIndex(img => img.id === image.id);
    this.selectedAlbum = this.currentBigImage.album
      ? this.currentBigImage.album.id
      : null;
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
        this.selectedImages = this.selectedImages.filter(val => val.id !== image.id);
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
      this.selectedImages = [];
      this.orm.getConnection().then(conn => {
        conn
          .getRepository<Day>("Day")
          .find()
          .then(files => {
            this._currentDays.next(List(files.slice(0, this.pageSize)));
            this.days = files;
            this.length = files.length;
            //this.loadimages(start+count, count);
          });
          conn
            .getRepository<Album>("Album")
            .find()
            .then(albums0 => {
              this.albums = albums0;
              this.massSelectedAlbum = this.albums.length > 0 ? this.albums[0].id : "";
            });
        this.fileRep = conn.getRepository<File>("File");
        if (!value.has("albumId")) {
          this.fileRep
            .find({
              where: { deleted: false },
              order: { createdAt: "ASC" },
              relations: ["fileSystem", "album"]
            })
            .then(images => {
              this.imageCount = images.length;
              this.images = images;
            });
        } else {
          conn
            .getRepository<Album>("Album")
            .findOne(value.get("albumId"))
            .then(album => {
              this.album = album;
              this.fileRep
                .find({
                  where: { deleted: false, album: this.album },
                  order: { createdAt: "ASC" },
                  relations: ["fileSystem", "album"]
                })
                .then(images => {
                  this.imageCount = images.length;
                  this.images = images;
                });
            });
        }
      });
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
