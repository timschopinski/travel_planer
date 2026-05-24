import { Component, OnInit } from '@angular/core';
import { Country } from '../../MyClasses/country';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-directives',
  imports: [CommonModule],
  templateUrl: './directives.html',
  styleUrl: './directives.css',
})
export class Directives implements OnInit {

  info = "List of countries"

  countries= new Array();

  public constructor(){}

  ngOnInit(): void {
    this.countries.push(new Country("Iran","Teheren",1648195));
    this.countries.push(new Country("Kenya","Nairobi",580367));
    this.countries.push(new Country("Turkey","Anakara",783562));
    this.countries.push(new Country("France","Paris",643801));
    this.countries.push(new Country("Ukraine","Kiev",603550));
    this.countries.push(new Country("Italy","Rome",302068));
  }

  getColor(index:number){
    if(index%3==0) return 'blue';
    if(index%3==1) return 'red';
    return 'green';
  }

  sortCountries(){
    this.countries.sort((a,b)=>(a.name<b.name?-1:1));
  }

}
