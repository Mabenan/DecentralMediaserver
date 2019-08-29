import { OnInit, Component, Input } from '@angular/core';
import { ImageStore } from '../services/image.service';
import { Day } from 'src/types/entity/Day';

@Component({
  selector: "app-image-group",
  templateUrl: "./image-group.component.html"
})
export class ImageGroupComponent implements OnInit {

  @Input()
  public day: Day;

  constructor(public imageStore: ImageStore) {}

  ngOnInit() {
  }


}
