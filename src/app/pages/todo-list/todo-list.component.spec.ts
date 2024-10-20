import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListComponent } from './todo-list.component';
import { DebugElement, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TodoItemComponent } from '../../components/todo-item/todo-item.component';
import { TodoData } from '../../components/todo-form/todo-data';
import { TodoBaseData } from '../../components/todo-form/todo-base-data';
import { TodoFormComponent } from '../../components/todo-form/todo-form.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListComponent, TodoListComponent, TodoFormComponent, ReactiveFormsModule],
    }).compileComponents();
  });
  beforeEach(async () => {
    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should adds a task', function() {
    const task: TodoBaseData = {task: 'Task 1', done: false}
    component.addTask(task)
    fixture.detectChanges()

    expect(component.todoList()[0].id).toBe(1)

    const task2: TodoBaseData = {task: 'Task 2', done: false}
    component.addTask(task2)
    fixture.detectChanges()

    expect(component.todoList()[1].id).toBe(2)
  })

  it('should shows tasks counter', () => {
    component.addTask({task: 'Test 1', done: false})
    component.addTask({task: 'Test 2', done: true})
    fixture.detectChanges();

    const counter = fixture.debugElement.query(By.css('.couter-section')).nativeElement

    expect(counter.textContent).toBe(component.todosDoneCounter() + " / " + component.todoList().length)
  })

  it('should list all tasks', () => {
    component.addTask({task: 'Test 1', done: false})
    component.addTask({task: 'Test 2', done: true})
    fixture.detectChanges();

    const tasks = component.todoList().map(t => t.task)

    const todoItems = fixture.debugElement.queryAll(By.directive(TodoItemComponent))
    todoItems.forEach((item) => {
      const taskText = item.nativeElement.querySelector('.task-text').textContent
      expect(tasks).toContain(taskText)
    })

    const messageContainer = fixture.nativeElement.querySelector('.empty-todo-list-section')
    expect(messageContainer).toBeNull()
  })

  it('should shows message when there is no tasks to list', function() {
    component.todoList.update(l => [])
    fixture.detectChanges()

    const messageContainer = fixture.nativeElement.querySelector('.empty-todo-list-section')
    expect(messageContainer?.textContent).not.toBeNull()
  })

  it('should filters task by search key and shows filtered tasks', function() {
    component.addTask({task: 'abc_task1', done: false})
    component.addTask({task: 'abc_task2', done: false})
    component.addTask({task: 'xyz_task1', done: false})
    component.searchKey = 'abc'
    fixture.detectChanges()

    const tasks = component.todoList().map(t => t.task)

    component.filteredList.forEach(f => {
      expect(tasks).toContain(f.task)
    })

    const todoItems = fixture.debugElement.queryAll(By.directive(TodoItemComponent))
    todoItems.forEach((item) => {
      const taskText = item.nativeElement.querySelector('.task-text').textContent
      expect(tasks).toContain(taskText)
    })
  })

  it('should edits a task', function() {
    component.addTask({task: 'Task', done: false})
    component.addTask({task: 'Task', done: false})
    fixture.detectChanges()

    // update first task
    const firstTask: TodoData = {id: 1, task: 'First Task',  done: false}
    component.updateTask(firstTask)
    expect(component.todoList()[0]).toBe(firstTask)

    // update second task
    const secondTask: TodoData = {id: 2, task: 'First Task', done: true}
    component.updateTask(secondTask)
    expect(component.todoList()[1].done).toBeTruthy()
  })

  it('should deletes a task', function() {
    component.addTask({task: 'Task', done: false})
    component.addTask({task: 'Task', done: false})
    fixture.detectChanges()

    const firstTaskId = 1
    const secondTaskId = 2

    component.deleteTask(firstTaskId)

    const remainTasksId = component.todoList().map(t => t.id)
    expect(remainTasksId).not.toContain(firstTaskId)
    expect(remainTasksId).toContain(secondTaskId)
  })

  it('should create a new task by the form', function() {
    const form = fixture.nativeElement.querySelector('.new-task-form')
    const input = form.querySelector('input')
    const taskName = 'Teste'
    input.value = taskName
    input.dispatchEvent(new Event('input'));
    form.dispatchEvent(new Event('submit'))
    fixture.detectChanges()

    expect(component.todoList().map(t=>t.task)).toContain(taskName)
  })
});
