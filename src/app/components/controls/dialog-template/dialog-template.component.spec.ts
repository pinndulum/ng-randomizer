import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogModel } from 'src/assets/dialog.message';
import { SafePipe } from 'src/app/pipes/safe.pipe';

import { DialogTemplateComponent } from './dialog-template.component';

const dialogData: DialogModel = {
  title: 'Test dialog',
  message: 'Dialog body'
};

describe('DialogTemplateComponent', () => {
  let component: DialogTemplateComponent;
  let fixture: ComponentFixture<DialogTemplateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DialogTemplateComponent, SafePipe],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: MatDialogRef, useValue: { close: () => undefined } }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});