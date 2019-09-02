import { Component, OnInit } from "@angular/core";
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
  selectedAlbum: string;
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

  constructor(private orm: TypeORMService) {}

  onClick(image: File) {
    this.currentBigImage = image;
    this.currentIndex = this.images.findIndex(img => img.id === image.id);
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
    this.selectedAlbum = this.currentBigImage.album ? this.currentBigImage.album.id : null;
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
    this.selectedAlbum = this.currentBigImage.album ? this.currentBigImage.album.id : null;
    }

  }

  close() {
    this.currentBigImage = undefined;
    this.currentIndex = undefined;
    this.selectedAlbum = undefined;
  }

  async onDelete(image: File): Promise<any> {
    return new Promise<any>((res, rej) => {this.images = this.images.filter(val => val.id !== image.id);
    this.orm.getConnection().then(conn => {
      image.deleted = true;
      conn.getRepository<File>("File").save(image); res();
    }); });
  }

  delete() {
    const imageToSave = this.currentBigImage;
    this.images = this.images.filter(val => val.id !== this.currentBigImage.id);
    this.imageCount = this.images.length;
    if (this.currentIndex >= this.imageCount) {
      this.currentIndex = this.currentIndex - 1;
    }
    this.currentBigImage = this.images[this.currentIndex];
    this.selectedAlbum = this.currentBigImage.album ? this.currentBigImage.album.id : null;
    this.orm.getConnection().then(conn => {
      imageToSave.deleted = true;
      conn.getRepository<File>("File").save(imageToSave);
    });
  }

  addToAlbum() {
    const imageToSave = this.currentBigImage;
    this.orm.getConnection().then(conn => {
      conn.getRepository<Album>("Album").findOne(this.selectedAlbum, {relations: ["files"]}).then(alb => {
        imageToSave.album = alb;
        this.fileRep.save(imageToSave);
    });
    });
  }

  ngOnInit() {
    this.orm.getConnection().then(conn => {
      conn
        .getRepository<Day>("Day")
        .find({
          //skip: start, take:count
        })
        .then(files => {
          this._currentDays.next(List(files.slice(0, this.pageSize)));
          this.days = files;
          this.length = files.length;
          //this.loadimages(start+count, count);
        });
      this.fileRep = conn.getRepository<File>("File");
      this.fileRep.find({ where: { deleted: false }, order: { createdAt: "ASC"}, relations: ["fileSystem", "album"]}).then((images) => {
        this.imageCount = images.length;
        this.images = images;
      });
      conn.getRepository<Album>("Album").find().then((albums0) => {
        this.albums = albums0;
      });
    });
  }
  onPage(event: PageEvent) {
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
