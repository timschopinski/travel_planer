import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-child-output',
  imports: [FormsModule],
  templateUrl: './child-output.html',
  styleUrl: './child-output.css',
})
export class ChildOutput {

  msg=""

  @Output() childMessage = new EventEmitter<string>()


  btnSend(){
    this.childMessage.emit("info from child: " + this.msg)

  }

}
