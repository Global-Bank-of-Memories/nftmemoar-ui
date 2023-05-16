import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlacesDashboardComponent } from './places-dashboard/places-dashboard.component';
import { PlacesListComponent } from './components/places-list/places-list.component';
import { PlacesGridComponent } from './components/places-grid/places-grid.component';
import { CreateEditPlaceComponent } from './components/create-edit-place/create-edit-place.component';
import { PlaceViewComponent } from './components/place-view/place-view.component';
import { PlacesRoutingModule } from './places-routing.module';
import { TableModule } from 'primeng/table';
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import { MemoCubeComponent } from './components/memo-cube/memo-cube.component';
import {InputSwitchModule} from "primeng/inputswitch";
import {DropdownModule} from "primeng/dropdown";
import {FileUploadModule} from "primeng/fileupload";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GoogleMapsModule} from "@angular/google-maps";
import {SelectButtonModule} from "primeng/selectbutton";
import {DialogService, DynamicDialogModule} from 'primeng/dynamicdialog';
import {PaginatorModule} from "primeng/paginator";
import {BlockUIModule} from "primeng/blockui";
import {PanelModule} from "primeng/panel";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {PasswordModule} from "primeng/password";

@NgModule({
  declarations: [
    PlacesDashboardComponent,
    PlacesListComponent,
    PlacesGridComponent,
    CreateEditPlaceComponent,
    PlaceViewComponent,
    MemoCubeComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PlacesRoutingModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    InputSwitchModule,
    DropdownModule,
    FileUploadModule,
    GoogleMapsModule,
    SelectButtonModule,
    FormsModule,
    DynamicDialogModule,
    PaginatorModule,
    BlockUIModule,
    PanelModule,
    ProgressSpinnerModule,
    PasswordModule
  ],
  providers: [DialogService]
})
export class PlacesModule { }
