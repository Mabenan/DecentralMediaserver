import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { TypeORMService } from "./TypeOrm.service";
import {List} from "immutable";

@Injectable({
  providedIn: "root"
})
export class ImageStore {
    private _images: BehaviorSubject<List<File>> = new BehaviorSubject(List([]));

    public readonly images: Observable<List<File>> = this._images.asObservable();

    constructor(private orm: TypeORMService) {
        this.loadInitialData();
    }
    loadInitialData() {
      this.loadimages(0, 100);
    }

    loadimages(start: number, count: number) {

      this.orm.getConnection().then(conn => {
        conn
          .getRepository<File>("File")
          .find({ relations: ["fileSystem"] })
          .then(files => {
            this._images.next(List(files));
            // const el = document.getElementById("mygallery");
            // lightGallery(el);
          });
      });
    }

}
