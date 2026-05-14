import { ClipboardModule } from '@angular/cdk/clipboard';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideRouter } from '@angular/router';
import { AlertService } from '../../../services/alert.service';

import { ChangeLogHistoryComponent } from './change-log-history.component';

describe('ChangeLogHistoryComponent', () => {
  let component: ChangeLogHistoryComponent;
  let fixture: ComponentFixture<ChangeLogHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClipboardModule, MatTooltipModule, ChangeLogHistoryComponent],
      providers: [
        provideRouter([]),
        { provide: AlertService, useValue: { showDialog: () => Promise.resolve(undefined) } }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChangeLogHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide seed controls until replay is enabled', () => {
    const nativeElement = fixture.nativeElement as HTMLElement;

    expect(nativeElement.querySelector('#change-history-replay')).toBeTruthy();
    expect(nativeElement.querySelector('#change-history-seed')).toBeNull();
    expect(nativeElement.querySelector('#change-history-clock-value')).toBeNull();
    expect(nativeElement.querySelector('button[type="button"]')?.textContent).toContain('Reload Content');
  });

  it('should show seed and fixed-clock controls when replay is enabled', () => {
    const replaySwitch = fixture.nativeElement.querySelector('#change-history-replay') as HTMLInputElement;

    replaySwitch.click();
    fixture.detectChanges();

    const nativeElement = fixture.nativeElement as HTMLElement;

    expect(nativeElement.querySelector('#change-history-seed')).toBeTruthy();
    expect(nativeElement.querySelector('#change-history-clock')).toBeTruthy();
    expect(nativeElement.querySelector('#change-history-clock-value')).toBeTruthy();
  });
});
