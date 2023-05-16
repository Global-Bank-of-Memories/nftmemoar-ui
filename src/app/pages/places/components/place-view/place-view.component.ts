import {Component, Input, OnInit} from '@angular/core';
import {IPlace} from '../../../../core/models/place.interface';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'app-place-view',
  templateUrl: './place-view.component.html',
  styleUrls: ['./place-view.component.scss']
})
export class PlaceViewComponent implements OnInit {
  place: IPlace | undefined;
  markerPosition!: google.maps.LatLngLiteral;
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
  }

  ngOnInit(): void {
    this.place = this.config.data;
    if (this.place) {
      this.markerPosition = {
        lat: Number(this.place.coordinates.split(':')[1].split(',')[0]),
        lng: Number(this.place.coordinates.split(':')[2].replace('}', '')),
      };
    }
  }
}
