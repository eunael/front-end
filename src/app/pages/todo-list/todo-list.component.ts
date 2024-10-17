import { Component, computed, signal, Signal, SimpleChanges } from '@angular/core';
import { TodoFormComponent } from "../../components/todo-form/todo-form.component";
import { TodoItemComponent } from '../../components/todo-item/todo-item.component';
import { TodoData } from '../../components/todo-form/todo-data';
import { TodoCounterComponent } from "../../components/todo-counter/todo-counter.component";

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [TodoFormComponent, TodoItemComponent, TodoCounterComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent {
  todoList: Array<TodoData> = []
  todosDoneCounter = signal(this.todoList.filter(t => t.done).length)

  addTask($event: TodoData)
  {
    this.todoList.push($event)
  }

  updateTask($event: TodoData) {
    const todoId = this.todoList.findIndex(todo => todo.task === $event.task)
    if(todoId < 0) {return}
    this.todoList[todoId] = $event
    this.todosDoneCounter.set(this.todoList.filter(t => t.done).length)
  }

  deleteTask($event: TodoData) {
    const todoId = this.todoList.findIndex(todo => todo.task === $event.task)
    if(todoId < 0) {return}
    this.todoList.splice(todoId, 1)
    this.todosDoneCounter.set(this.todoList.filter(t => t.done).length)
  }
}
