import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TzClockListComponent } from './tz-clock-list.component';

describe('TzClockListComponent', () => {
  let component: TzClockListComponent;
  let fixture: ComponentFixture<TzClockListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TzClockListComponent ]
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
