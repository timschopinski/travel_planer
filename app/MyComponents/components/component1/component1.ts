import { Component } from '@angular/core';
import { Message } from '../../../MyServices/message';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-component1',
  imports: [FormsModule],
  templateUrl: './component1.html',
  styleUrl: './component1.css',
})
export class Component1 {

  msg=""

  constructor(private messageService:Message){
    
  }

  btnSend(){
    this.messageService.sendMessage("msg form component1:" + this.msg)


  }

}
