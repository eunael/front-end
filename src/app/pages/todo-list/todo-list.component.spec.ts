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
  let STORAGE_KEY: string;
  // Mock do localStorage
  const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      clear: () => {
        store = {};
      },
    };
  })();


  beforeEach(async () => {
    // Mocka o localStorage global
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    await TestBed.configureTestingModule({
      imports: [TodoListComponent, TodoListComponent, TodoFormComponent, ReactiveFormsModule],
    }).compileComponents();
  });
  beforeEach(async () => {
    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    STORAGE_KEY = component['STORAGE_KEY']
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

    const tasksFromLS: TodoData[] = JSON.parse(localStorageMock.getItem(STORAGE_KEY) ?? "[]")
    expect(tasksFromLS.length).not.toBe(0)
    tasksFromLS.forEach(t => expect([1, 2]).toContain(t.id))
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

  it('should list all tasks from local storage', () => {
    const tasks: TodoData[] = [
      { id: 1, task: 'Teste 1', done: false },
      { id: 2, task: 'Teste 2', done: false }
    ]

    localStorageMock.setItem(STORAGE_KEY, JSON.stringify(tasks))

    component.loadTodoTasksFromLocalStorage()
    fixture.detectChanges()

    expect(component.todoList()).toStrictEqual(tasks)

    const tasksNames = tasks.map(t => t.task)
    const todoItems = fixture.debugElement.queryAll(By.directive(TodoItemComponent))
    todoItems.forEach((item) => {
      const taskText = item.nativeElement.querySelector('.task-text').textContent
      expect(tasksNames).toContain(taskText)
    })
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

    const tasksFromLS: TodoData[] = JSON.parse(localStorageMock.getItem(STORAGE_KEY) ?? "[]")
    expect(tasksFromLS.at(0)).toStrictEqual(firstTask)
    expect(tasksFromLS.at(1)).toStrictEqual(secondTask)
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

    const tasksFromLS: TodoData[] = JSON.parse(localStorageMock.getItem(STORAGE_KEY) ?? "[]")
    expect(tasksFromLS.map(t => t.id)).not.toContain(firstTaskId)
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

  it('should edit task', ()  => {
    component.addTask({task: 'Test 1', done: false})
    component.addTask({task: 'Test 2', done: true})
    fixture.detectChanges();

    const firstTask = fixture.nativeElement.querySelector('.todo-item-section')
    firstTask.querySelector('.task-btn-edit').dispatchEvent(new Event('click'))
    fixture.detectChanges()
    const firstForm = firstTask.querySelector('form.task-edit-form')
    const firstInput = firstForm.querySelector('input.task-edit-input')
    firstInput.value = 'Cool task'
    firstInput.dispatchEvent(new Event('input'))
    firstForm.dispatchEvent(new Event('submit'))
    fixture.detectChanges()
    expect(component.todoList().at(0)?.task).toBe('Cool task')

    const secondTask = fixture.nativeElement.querySelectorAll('.todo-item-section').item(1)
    secondTask.querySelector('.task-btn-edit').dispatchEvent(new Event('click'))
    fixture.detectChanges()
    const secondForm = secondTask.querySelector('form.task-edit-form')
    const secondInput = secondForm.querySelector('input.task-edit-input')
    secondInput.value = 'Awesome task'
    secondInput.dispatchEvent(new Event('input'))
    secondForm.dispatchEvent(new Event('submit'))
    fixture.detectChanges()
    expect(component.todoList().at(1)?.task).toBe('Awesome task')
  })

  it('should delete task', ()  => {
    component.addTask({task: 'Test 1', done: false})
    component.addTask({task: 'Test 2', done: true})
    fixture.detectChanges();

    const firstTask = fixture.nativeElement.querySelector('.todo-item-section')
    firstTask.querySelector('.task-btn-delete').dispatchEvent(new Event('click'))
    fixture.detectChanges()

    expect(component.todoList().map(t => t.task)).not.toContain('Test 1')
    expect(component.todoList().map(t => t.task)).toContain('Test 2')

    const secondTask = fixture.nativeElement.querySelector('.todo-item-section')
    secondTask.querySelector('.task-btn-delete').dispatchEvent(new Event('click'))
    fixture.detectChanges()

    expect(component.todoList().map(t => t.task)).not.toContain('Test 2')
  })

  afterEach(() => {
    // Limpa o mock do localStorage após cada teste
    localStorage.clear();
  });
});
