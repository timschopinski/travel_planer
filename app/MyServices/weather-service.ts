import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {

  constructor(private http:HttpClient){

  }

  public getJSON(url:string):Observable<any>{
    return this.http.get(url);
  }
  
}
