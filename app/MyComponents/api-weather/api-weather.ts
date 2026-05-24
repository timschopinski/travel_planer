import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WeatherModel } from '../../MyClasses/weather-model';
import { WeatherService } from '../../MyServices/weather-service';

@Component({
  selector: 'app-api-weather',
  imports: [FormsModule],
  templateUrl: './api-weather.html',
  styleUrl: './api-weather.css',
})
export class ApiWeather {

  city_name=""

  showInfoModule=false

  weatherModel:WeatherModel;

  constructor(private weatherService:WeatherService){
    this.weatherModel = new WeatherModel()
  }

  GetWeatherStats(){
    this.weatherService.getJSON(`http://api.weatherapi.com/v1/current.json?key=6fed8bb1bfd24dc090a115944231504&q=${this.city_name}&aqi=no`

    ).subscribe({
      next:(data)=>{
       // console.log(data)
        this.weatherModel.cityName = data.location.name;
        this.weatherModel.temperature = data.current.temp_c;
        this.weatherModel.icon = data.current.condition.icon;
        this.weatherModel.text = data.current.condition.text;

      },
      error:err=>{
        console.log("Error: ",err)
        this.showInfoModule=false
      },
      complete:()=>console.log("Notification is completed")
    })

    if(this.weatherModel.cityName!=""){
      this.showInfoModule=true;
    }

  }

}
