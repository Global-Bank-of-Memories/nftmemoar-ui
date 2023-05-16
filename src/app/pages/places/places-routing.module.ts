import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlacesDashboardComponent } from './places-dashboard/places-dashboard.component';
import { CreateEditPlaceComponent } from './components/create-edit-place/create-edit-place.component';
import {authGuard} from "../../core/guards/auth.guard";

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      canActivate: [authGuard],
      component: PlacesDashboardComponent,
    },
    {
      path: 'create',
      canActivate: [authGuard],
      component: CreateEditPlaceComponent,
    },
    {
      path: 'edit/:id',
      canActivate: [authGuard],
      component: CreateEditPlaceComponent,
    },
  ])],
  exports: [RouterModule]
})
export class PlacesRoutingModule { }
