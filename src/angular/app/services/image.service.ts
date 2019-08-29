import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { TypeORMService } from "./TypeOrm.service";
import {List} from "immutable";
import { ProgressService } from './progress.service';
import { File } from 'src/types/entity/File';
import { Day } from 'src/types/entity/Day';
import { ClassField } from '@angular/compiler';
declare var lightGallery: any;

@Injectable({
  providedIn: "root"
})
export class ImageStore {
    private _days: BehaviorSubject<List<Day>> = new BehaviorSubject(List([]));

    public readonly days: Observable<List<Day>> = this._days.asObservable();

    constructor(private orm: TypeORMService, private progressService : ProgressService) {
        this.loadInitialData();
    }
    loadInitialData() {
      this.loadimages(0, 1000);
    }

    public migrate(){
      this.orm.getConnection().then(conn => {
        conn
          .getRepository<File>("File")
          .find().then((files) =>{
            const days: Day[] = [];
            files.forEach((file) =>{
              const today = file.createdAt;
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
let day = days.find(val => val.day === date);
if(!day){
  day = new Day();
  day.day = date;
  days.push(day);
}
file.day = day;
            });
            conn.getRepository<File>("File").save(files);
            conn.getRepository<Day>("Day").save(days);
          });
        });
    }

    loadimages(start: number, count: number) {
    }

}
