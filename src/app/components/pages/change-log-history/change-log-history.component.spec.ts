import { ClipboardModule } from '@angular/cdk/clipboard';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideRouter } from '@angular/router';

import { ChangeLogHistoryComponent } from './change-log-history.component';

describe('ChangeLogHistoryComponent', () => {
  let component: ChangeLogHistoryComponent;
  let fixture: ComponentFixture<ChangeLogHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClipboardModule, MatTooltipModule, ChangeLogHistoryComponent],
      providers: [provideRouter([])]
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
