import {Component, EventEmitter, Input, Output} from '@angular/core';
import { IPlace } from '../../../../core/models/place.interface';

@Component({
  selector: 'app-places-list',
  templateUrl: './places-list.component.html',
  styleUrls: ['./places-list.component.scss']
})
export class PlacesListComponent {
  @Input() places: IPlace[] = [];
  @Input() totalRecords!: number;
  @Input() isLoading: boolean = false;
  @Output() onPlaceView = new EventEmitter<string>();
  @Output() onPlaceEdit = new EventEmitter<string>();
  @Output() onPlaceDelete = new EventEmitter<string>();

  constructor() {
  }

  onView(id: string) {
    this.onPlaceView.emit(id);
  }

  onEdit(id: string) {
    this.onPlaceEdit.emit(id);
  }

  onDelete(id: string) {
    this.onPlaceDelete.emit(id);
  }
}
