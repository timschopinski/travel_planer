import { Routes } from '@angular/router';

import { Directives } from './MyComponents/directives/directives';
import { Home } from './MyComponents/home/home';
import { Parent } from './MyComponents/components/parent/parent';
import { ApiWeather } from './MyComponents/api-weather/api-weather';
import { Maincrud } from './MyComponents/crud/maincrud/maincrud';

export const routes: Routes = [
        {path:'',component:Home},
        {path:'home',component:Home},
        {path:'directives',component:Directives},
        {path:'comp_communication',component:Parent},
        {path:'apiWeather',component:ApiWeather},
        {path:'crud',component:Maincrud},

];
