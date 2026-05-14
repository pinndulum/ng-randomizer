import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TzClockComponent } from '../tz-clock/tz-clock.component';
import { TzClockListComponent } from './tz-clock-list.component';

describe('TzClockListComponent', () => {
  let component: TzClockListComponent;
  let fixture: ComponentFixture<TzClockListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TzClockComponent, TzClockListComponent]
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TzClockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});