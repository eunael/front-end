import { Component, signal, WritableSignal } from '@angular/core';
import { TodoFormComponent } from "../../components/todo-form/todo-form.component";
import { TodoItemComponent } from '../../components/todo-item/todo-item.component';
import { TodoData } from '../../components/todo-form/todo-data';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [TodoFormComponent, TodoItemComponent, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent {
  todoList: WritableSignal<TodoData[]> = signal([{task: 'Teset', done: false}])
  todosDoneCounter = signal(this.todoList().filter(t => t.done).length)
  searchKey: string = ''
  filteredList = this.todoList()

  filterTasks()
  {
    if(!this.searchKey.trim()) {
      this.filteredList = this.todoList()
      return
    }

    this.filteredList = this.todoList().filter((t: TodoData)  => t.task.toLowerCase().includes(this.searchKey.toLowerCase()))
  }

  addTask($event: TodoData)
  {
    this.todoList.update(list => {
      list.push($event)
      return list
    })
    this.filterTasks()
  }

  updateTask($event: TodoData) {
    const todoId = this.todoList().findIndex(todo => todo.task === $event.task)
    if(todoId < 0) {return}
    this.todoList.update(list => {
      list[todoId] = $event
      return list
    })
    this.todosDoneCounter.set(this.todoList().filter(t => t.done).length)
    this.filterTasks()
  }

  deleteTask($event: TodoData) {
    const todoId = this.todoList().findIndex(todo => todo.task === $event.task)
    if(todoId < 0) {return}
    this.todoList.update(list => {
      list.splice(todoId, 1)
      return list
    })
    this.todosDoneCounter.set(this.todoList().filter(t => t.done).length)
    this.filterTasks()
  }
}
