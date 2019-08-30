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

  constructor(private orm: TypeORMService) {}

  onClick(image: File){
    this.currentBigImage = image;
  }
  previouseImage(image: File){
    let imageIndex = -1;
    if(this.currentIndex !== undefined){
      imageIndex = this.currentIndex - 1;
    }else{
    imageIndex = this.images.findIndex(img => img.id === image.id) - 1;
    }
    if(imageIndex >= 0){
      this.currentIndex = imageIndex;
    this.currentBigImage = this.images[imageIndex];
    }
  }
  nextImage(image: File){
    let imageIndex = -1;
    if(this.currentIndex !== undefined){
      imageIndex = this.currentIndex + 1;
    }else{
    imageIndex = this.images.findIndex(img => img.id === image.id) + 1;
    }
    if(imageIndex < this.imageCount - 1){
      this.currentIndex = imageIndex;
    this.currentBigImage = this.images[imageIndex];
    }

  }

  close(){
    this.currentBigImage = undefined;
    this.currentIndex = undefined;
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
      conn.getRepository<File>("File").find({order: { createdAt: "ASC"}, relations: ["fileSystem"]}).then((images) => {
        this.imageCount = images.length;
        this.images = images;
      })
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
