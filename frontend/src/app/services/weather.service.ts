import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherInfo } from '../models/trip.model';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly api = '/api/weather';

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<WeatherInfo> {
    return this.http.get<WeatherInfo>(`${this.api}/${encodeURIComponent(city)}`);
  }

  getWeatherEmoji(code: number | null): string {
    if (code === null) return '🌍';
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 57) return '🌦️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '❄️';
    if (code <= 82) return '🌧️';
    if (code <= 86) return '🌨️';
    return '⛈️';
  }
}
