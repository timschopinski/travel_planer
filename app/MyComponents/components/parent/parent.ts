import { Component } from '@angular/core';
import { Child } from '../child/child';
import { FormsModule } from '@angular/forms';
import { ChildOutput } from '../child-output/child-output';
import { Component1 } from '../component1/component1';
import { Component2 } from '../component2/component2';

@Component({
  selector: 'app-parent',
  imports: [FormsModule, Child,ChildOutput,Component1,Component2],
  templateUrl: './parent.html',
  styleUrl: './parent.css',
})
export class Parent {


  msg = ""

  messageToChild = ""

  messageFromChild=""


  btnSendClick() {
    // alert("btn clicked")

    this.messageToChild = "parent msg: " + this.msg
  }

  getMessage(info:string){
    this.messageFromChild = info;
  }

}
