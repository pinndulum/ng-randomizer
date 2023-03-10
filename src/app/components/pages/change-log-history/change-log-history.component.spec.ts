import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLogHistoryComponent } from './change-log-history.component';

describe('ChangeLogHistoryComponent', () => {
  let component: ChangeLogHistoryComponent;
  let fixture: ComponentFixture<ChangeLogHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeLogHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeLogHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
