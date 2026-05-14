import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TZItem, TzClockComponent } from './tz-clock.component';

describe('TzClockComponent', () => {
  let component: TzClockComponent;
  let fixture: ComponentFixture<TzClockComponent>;
  const pacificZone: TZItem = {
    title: 'Pacific',
    location: 'North America',
    abbrevs: {
      standard: { name: 'PST', offset: -8 },
      daylight: { name: 'PDT', offset: -7 }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [TzClockComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TzClockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('uses daylight time for North American zones during DST', () => {
    fixture.componentRef.setInput('zone', pacificZone);
    component.dt.set(new Date(Date.UTC(2026, 6, 1, 12)));
    fixture.detectChanges();

    expect(component.tz.name).toBe('PDT');
    expect(component.tzOffset).toBe('-0700');
  });

  it('uses standard time for North American zones outside DST', () => {
    fixture.componentRef.setInput('zone', pacificZone);
    component.dt.set(new Date(Date.UTC(2026, 0, 1, 12)));
    fixture.detectChanges();

    expect(component.tz.name).toBe('PST');
    expect(component.tzOffset).toBe('-0800');
  });
});
