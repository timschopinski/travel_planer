import { Component } from '@angular/core';
import { Message } from '../../../MyServices/message';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-component2',
  imports: [],
  templateUrl: './component2.html',
  styleUrl: './component2.css',
})
export class Component2 {


  message=""

  subscription:Subscription;

  constructor(private messageService:Message){
    this.subscription = this.messageService.getMessage().subscribe(msg=>{
      this.message=msg;
    })
    
  }

}
