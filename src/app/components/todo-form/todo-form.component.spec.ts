import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoFormComponent } from './todo-form.component';
import { By } from '@angular/platform-browser';

describe('TodoFormComponent', () => {
  let component: TodoFormComponent;
  let fixture: ComponentFixture<TodoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save a new task', function() {
    const formDe = fixture.debugElement.query(By.css('.new-task-form'))
    component.form.setValue({task: 'Teste'})

    expect(component.form.valid).toBeTruthy()

    formDe.triggerEventHandler('submit')

    expect(component.form.value.task).toBe(null)
  })

  test('validate rules', function() {
    // required
    component.form.setValue({task: ''})
    expect(component.form.valid).toBeFalsy()
    expect(component.form.controls['task'].hasError('required')).toBeTruthy()

    // minlength  4
    component.form.setValue({task: '123'})
    expect(component.form.valid).toBeFalsy()
    expect(component.form.controls['task'].hasError('minlength')).toBeTruthy()
  })
});
