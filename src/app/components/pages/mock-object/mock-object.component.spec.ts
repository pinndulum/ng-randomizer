import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockObjectComponent } from './mock-object.component';

describe('MockObjectComponent', () => {
  let component: MockObjectComponent;
  let fixture: ComponentFixture<MockObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockObjectComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MockObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
