import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TzClockComponent } from './tz-clock.component';

describe('TzClockComponent', () => {
  let component: TzClockComponent;
  let fixture: ComponentFixture<TzClockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TzClockComponent ]
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
});
