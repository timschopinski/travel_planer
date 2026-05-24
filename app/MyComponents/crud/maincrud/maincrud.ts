import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TaskService } from '../../../MyServices/task-service';
import { TaskForm } from '../task-form/task-form';

@Component({
  selector: 'app-maincrud',
  imports: [CommonModule,TaskForm],
  templateUrl: './maincrud.html',
  styleUrl: './maincrud.css',
})
export class Maincrud implements OnInit {


  private taskService = inject(TaskService)

  tasks$ = this.taskService.tasks$

  selectedTask:any = null

  ngOnInit(): void {
    this.taskService.loadTasks()
    this.taskService.listenRealtime()
  }

  async update(task:any){
    this.selectedTask = task;
  }

  async delete(id:string){
    await this.taskService.deleteTask(id)
    await this.taskService.loadTasks()
  }

  onSaved(){
    this.selectedTask=null;
    this.taskService.loadTasks();
  }



}
