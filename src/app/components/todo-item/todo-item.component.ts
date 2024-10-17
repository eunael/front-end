import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TodoData } from '../todo-form/todo-data';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss'
})
export class TodoItemComponent {
  @Input() todo: TodoData = {task: '', done: false};
  @Output() updatedTask = new EventEmitter<TodoData>()
  @Output() deletedTask = new EventEmitter<TodoData>()
  taskForm!: FormGroup
  editing: boolean = false

  constructor() {
    this.taskForm = new FormGroup({
      task: new FormControl('', Validators.required)
    })
  }

  ngOnInit() {
    this.taskForm.patchValue({
      task: this.todo.task
    })
  }

  toggleDone() {
    this.todo.done = !this.todo.done

    this.updatedTask.emit(this.todo)
  }

  toggleEditing() {
    this.editing = !this.editing
  }

  update() {
    if(!this.editing) {
      return
    } else if (!this.taskForm.valid) {
      console.log('invalid')
      return
    }

    this.todo.task = this.taskForm.value.task

    this.toggleEditing()

    this.updatedTask.emit(this.todo)
  }

  delete() {
    this.deletedTask.emit(this.todo)
  }
}
