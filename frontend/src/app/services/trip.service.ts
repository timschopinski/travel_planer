import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip, TripCreate, TripUpdate } from '../models/trip.model';

@Injectable({ providedIn: 'root' })
export class TripService {
  private readonly api = '/api/trips';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.api}/`);
  }

  create(data: TripCreate): Observable<Trip> {
    return this.http.post<Trip>(`${this.api}/`, data);
  }

  update(id: number, data: TripUpdate): Observable<Trip> {
    return this.http.put<Trip>(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
