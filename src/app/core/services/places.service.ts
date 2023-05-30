import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import {IFilter} from "../models/filter.interface";

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) {
  }

  getPlacesList(filter: IFilter) {
    return this.http.get(`${this.apiUrl}/memo?entries=${filter.entries}&page=${filter.page}&search=${filter.search}`)
      .pipe(catchError((err: HttpErrorResponse) => throwError(err)));
  }

  createDigitalMemory(data: any) {
    return this.http.post(`${this.apiUrl}/memo`, data)
      .pipe(catchError((err: HttpErrorResponse) => throwError(err)));
  }

  deleteDigitalMemory(id: string) {
    return this.http.delete(`${this.apiUrl}/memo/${id}`)
      .pipe(catchError((err: HttpErrorResponse) => throwError(err)));
  }

  editDigitalMemory(data: any) {
    return this.http.patch(`${this.apiUrl}/memo`, data)
      .pipe(catchError((err: HttpErrorResponse) => throwError(err)));
  }

  getCreationPrice(data: any) {
    return this.http.post(`${this.apiUrl}/check-amount`, data)
      .pipe(catchError((err: HttpErrorResponse) => throwError(err)));
  }

  getPlaceDetails(id: string) {
    return this.http.get(`${this.apiUrl}/memo/${id}`)
      .pipe(catchError((err: HttpErrorResponse) => throwError(err)));
  }
}
