import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Message {

  private subject = new Subject<any>();

  constructor(){}

  sendMessage(message:string){
    this.subject.next(message)

  }

  getMessage():Observable<any>{
    return this.subject.asObservable();
  }

  clearMessage(){
    this.subject.next(null)
  }
  
}
