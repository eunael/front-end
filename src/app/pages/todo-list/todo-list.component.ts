import { Component, signal, WritableSignal } from '@angular/core';
import { TodoFormComponent } from "../../components/todo-form/todo-form.component";
import { TodoItemComponent } from '../../components/todo-item/todo-item.component';
import { TodoData } from '../../components/todo-form/todo-data';
import { FormsModule } from '@angular/forms';
import { TodoBaseData } from '../../components/todo-form/todo-base-data';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [TodoFormComponent, TodoItemComponent, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss'
})
export class TodoListComponent {
  todoList: WritableSignal<TodoData[]> = signal([])
  todosDoneCounter = signal(this.todoList().filter(t => t.done).length)
  searchKey: string = ''
  filteredList: TodoData[]  = this.todoList()

  filterTasks()
  {
    if(!this.searchKey.trim()) {
      this.filteredList = this.todoList()
      return
    }

    this.filteredList = this.todoList().filter((t: TodoData)  => t.task.toLowerCase().includes(this.searchKey.toLowerCase()))
  }

  addTask($event: TodoBaseData)
  {
    const id = this.generateTaskId()
    this.todoList.update(list => {
      list.push({
        id,
        task: $event.task,
        done: $event.done
      })
      return list
    })
    this.filterTasks()
  }

  updateTask($event: TodoData) {
    const taskIndex = this.todoList().findIndex(todo => todo.id === $event.id)
    if(taskIndex < 0) {return}
    this.todoList.update(list => {
      list[taskIndex] = $event
      return list
    })
    this.todosDoneCounter.set(this.todoList().filter(t => t.done).length)
    this.filterTasks()
  }

  deleteTask($event: number) {
    const todoId = this.todoList().findIndex(todo => todo.id === $event)
    if(todoId < 0) {return}
    this.todoList.update(list => {
      list.splice(todoId, 1)
      return list
    })
    this.todosDoneCounter.set(this.todoList().filter(t => t.done).length)
    this.filterTasks()
  }

  generateTaskId(): number
  {
    const lastPosition = this.todoList().length - 1
    const lastTaskCreated = this.todoList().at(lastPosition)

    return lastTaskCreated ? lastTaskCreated.id + 1 : 1
  }
}
