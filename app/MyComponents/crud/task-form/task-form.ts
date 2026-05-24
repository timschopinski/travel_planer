import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../MyServices/task-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {

  @Input() task: any = null
  @Output() saved = new EventEmitter<void>()
  @Output() cancel = new EventEmitter<void>()

  editingId: string | null = null;

  private fb = inject(FormBuilder)

  private taskService = inject(TaskService)

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    priority: ['medium'],
    status: ['new']
  })

  ngOnChanges() {
    if (this.task) {
      this.editingId = this.task.id;

      this.form.patchValue({
        title: this.task.title,
        description: this.task.description,
        priority: this.task.priority,
        status: this.task.status
      })
    }
  }

  async submit() {
    if (!this.form.valid) return

    const value = this.form.value;

    if (this.editingId) {
      await this.taskService.updateTask(this.editingId, value as any)
    }
    else {
      await this.taskService.addTask(value as any)
    }
    this.reset();
    this.saved.emit()
  }

  reset(){
    this.form.reset({
      priority:'medium',
      status:'new'
    });

    this.editingId=null
    this.cancel.emit()
  }

}
