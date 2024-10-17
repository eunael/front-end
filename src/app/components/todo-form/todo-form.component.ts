import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoData } from './todo-data';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss'
})
export class TodoFormComponent {
  form!: FormGroup;
  @Output() createdTask = new EventEmitter<TodoData>()

  constructor() {
    this.form = new FormGroup({
      task: new FormControl('', [Validators.required])
    })
  }

  save() {
    if(!this.form.valid) {
      console.log('invalid')
      return
    }
    this.createdTask.emit({
      task: this.form.value.task,
      done: false
    })
    this.form.reset()
  }
}
