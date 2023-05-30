import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPlace } from '../../../core/models/place.interface';
import { PlacesService } from '../../../core/services/places.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PlaceViewComponent } from '../components/place-view/place-view.component';
import {BehaviorSubject, takeUntil} from "rxjs";
import {IFilter} from "../../../core/models/filter.interface";
import {Unsubscribable} from "../../../core/models/unsubscribable";
import {DeleteConfirmationComponent} from "../components/delete-confirmation/delete-confirmation.component";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-places-dashboard',
  templateUrl: './places-dashboard.component.html',
  styleUrls: ['./places-dashboard.component.scss']
})
export class PlacesDashboardComponent extends Unsubscribable implements OnInit {
  places: IPlace[] = [];
  totalRecords: number = 0;
  viewModeOptions = [
    { value: 'table', label: 'table', icon: 'pi pi-list' },
    { value: 'grid', label: 'grid', icon: 'pi pi-th-large' }
  ];
  viewMode = this.viewModeOptions[0];
  isLoading: boolean = true;
  dialogRef!: DynamicDialogRef;
  entriesOptions = [20, 30, 40];
  pageSize = this.entriesOptions[0];
  searchString: string = '';
  initialFilter: IFilter = {
    search: this.searchString,
    page: 1,
    entries: this.pageSize
  }
  filterOptions: BehaviorSubject<IFilter> = new BehaviorSubject(this.initialFilter);
  constructor(
    public dialogService: DialogService,
    private placesService: PlacesService,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.filterOptions
      .pipe(takeUntil(this.destroyed$))
      .subscribe((filter) => {
        this.getPlaces(filter);
      });
  }

  onPlaceView(id: string) {
    const memo = this.places.find((place) => place.public_id === id);
    this.dialogRef = this.dialogService.open(PlaceViewComponent, {
      header: memo?.name,
      dismissableMask: true,
      closeOnEscape: true,
      data: memo,
      styleClass: 'dialog-medium'
    });
  }

  onPlaceEdit(id: string) {
    this.router.navigate([`places/edit/${id}`]);
  }

  onPlaceDelete(id: string) {
    const memo = this.places.find((place) => place.public_id === id);
    this.dialogRef = this.dialogService.open(DeleteConfirmationComponent, {
      dismissableMask: true,
      closeOnEscape: true,
      data: memo,
      styleClass: 'dialog-small'
    });
    this.dialogRef
      .onClose
      .pipe(
        filter(res => !!res),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => {
        this.onDelete(id);
      })
  }

  onPlaceCreate() {
    this.router.navigate(['places/create']);
  }

  getPlaces(filter: IFilter) {
    this.isLoading = true;
    this.placesService.getPlacesList(filter).subscribe((res: any) => {
      this.places = res.data.memos;
      this.totalRecords = res.data.total_entries;
      this.isLoading = false;
    });
  }

  onPageSizeChange(entries: number) {
    this.pageSize = entries;
    this.filterOptions.next({
      ...this.filterOptions.value,
      entries
    })
  }

  onPageChange(page: number) {
    this.filterOptions.next({
      ...this.filterOptions.value,
      page: page + 1
    })
  }

  onSearch() {
    this.filterOptions.next({
      ...this.filterOptions.value,
      search: this.searchString
    });
  }

  onDelete(id: string) {
    this.placesService.deleteDigitalMemory(id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res: any) => {
        this.filterOptions.next({
          ...this.filterOptions.value,
          page: 1
      });
    });
  }

  private openDeleteConfirmationDialog(id: string) {

  }
}
