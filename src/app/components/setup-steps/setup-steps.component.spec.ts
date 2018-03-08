import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupStepsComponent } from './setup-steps.component';

describe('SetupStepsComponent', () => {
  let component: SetupStepsComponent;
  let fixture: ComponentFixture<SetupStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
