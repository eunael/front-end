import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoData } from './todo-data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule
  ],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.scss'
})
export class TodoFormComponent {
  form!: FormGroup;
  @Output() createdTask = new EventEmitter<TodoData>()

  ngOnInit() {
    this.form = new FormGroup({
      task: new FormControl('', [Validators.required, Validators.minLength(4)])
    })
  }

  save() {
    if(!this.form.valid) {
      console.log('invalid')
      return
    }
    this.createdTask.emit({
      id: 1,
      task: this.form.value.task,
      done: false
    })
    this.form.reset()
  }
}
