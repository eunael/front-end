import { Component, Input, signal, Signal, SimpleChanges } from '@angular/core';
import { TodoData } from '../todo-form/todo-data';

@Component({
  selector: 'app-todo-counter',
  standalone: true,
  imports: [],
  templateUrl: './todo-counter.component.html',
  styleUrl: './todo-counter.component.scss'
})
export class TodoCounterComponent {
  @Input() list: Array<TodoData> = []
  todosDoneCounter = signal(this.list.filter(t => t.done).length)

  ngOnChanges(changes: SimpleChanges) {
    this.todosDoneCounter.set(changes['list'].currentValue.filter((t: TodoData) => t.done).length)
  }
}
