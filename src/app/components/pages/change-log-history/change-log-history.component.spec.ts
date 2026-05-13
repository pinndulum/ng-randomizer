import { ClipboardModule } from '@angular/cdk/clipboard';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ChangeLogHistoryComponent } from './change-log-history.component';

describe('ChangeLogHistoryComponent', () => {
  let component: ChangeLogHistoryComponent;
  let fixture: ComponentFixture<ChangeLogHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeLogHistoryComponent],
      imports: [ClipboardModule, MatTooltipModule]
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
