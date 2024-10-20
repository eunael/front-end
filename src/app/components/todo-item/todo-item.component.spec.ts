import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoItemComponent } from './todo-item.component';
import { By } from '@angular/platform-browser';

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should shows task informations', function()  {
    component.todo = {id: 1, task: 'Test', done: false}
    fixture.detectChanges()

    const todoItem = fixture.nativeElement
    expect(todoItem.querySelector('input.task-input-done').checked).toBeFalsy()
    expect(todoItem.querySelector('span.task-text').textContent).toBe(component.todo.task)
    expect(todoItem.querySelector('.task-actions')).not.toBeNull()
  })

  it('should toggle task done status', () => {
    component.todo = {id: 1, task: 'Test', done: false}
    fixture.detectChanges()

    component.toggleDone()
    fixture.detectChanges()
    expect(component.todo.done).toBeTruthy()
    expect(fixture.nativeElement.querySelector('input.task-input-done').checked).toBeTruthy()

    component.toggleDone()
    fixture.detectChanges()
    expect(component.todo.done).toBeFalsy()
    expect(fixture.nativeElement.querySelector('input.task-input-done').checked).toBeFalsy()
  })

  it('should toggle task editing status', () => {
    component.todo = {id: 1, task: 'Test', done: false}
    fixture.detectChanges()

    component.toggleEditing()
    fixture.detectChanges()
    expect(component.editing).toBeTruthy()
    expect(fixture.nativeElement.querySelector('form.task-edit-form')).not.toBeNull()

    component.toggleEditing()
    fixture.detectChanges()
    expect(component.editing).toBeFalsy()
    expect(fixture.nativeElement.querySelector('form.task-edit-form')).toBeNull()
  })

  it('should update a task', () => {
    component.todo = {id: 1, task: 'Test', done: false}
    fixture.detectChanges()

    component.taskForm.setValue({task: 'Cool Task'})
    expect(component.taskForm.valid).toBeTruthy()

    component.update()
    fixture.detectChanges()
    expect(component.todo.task).toBe('Test')

    component.toggleEditing()
    component.update()
    fixture.detectChanges()
    expect(component.todo.task).toBe('Cool Task')
    expect(component.editing).toBeFalsy()
  })
});
