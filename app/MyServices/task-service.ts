import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../MyClasses/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {

  private tasksSubject = new BehaviorSubject<Task[]>([])

  tasks$ = this.tasksSubject.asObservable()

  constructor(@Inject('SUPABASE') private supabase: any) { }

  async loadTasks() {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) {
      this.tasksSubject.next(data || [])
    }
    else {
      console.log("Error:", error)
    }
  }

  async addTask(task:Task){
    await this.supabase
      .from('tasks')
      .insert(task)
  }

  async updateTask(id:string, task:Task){
     await this.supabase
      .from('tasks')
      .update(task)
      .eq('id',id)
  }

  async deleteTask(id:string){
     await this.supabase
      .from('tasks')
      .delete()
      .eq('id',id)
  }

  listenRealtime(){
    this.supabase
    .channel('tasks-channel')
    .on(
      'postgres_changes',
      {event: '*',schema:'public', table:'tasks'},
      (payload:any)=>{
        this.handleChange(payload)
      }
    )
    .subscribe()
  }

  private handleChange(payload:any){
    const current = this.tasksSubject.value

    if(payload.eventType === 'INSERT'){
      this.tasksSubject.next([payload.new,...current])
    }

    if(payload.eventType === 'DELETE'){
      this.tasksSubject.next(current.filter(t=>t.id !== payload.old.id))
    }

    if(payload.eventType === 'UPDATE'){
      this.tasksSubject.next(current.map(t=>t.id === payload.new.id ? payload.new:t))
    }

  }

}
