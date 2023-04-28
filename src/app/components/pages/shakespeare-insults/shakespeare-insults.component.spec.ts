import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShakespeareInsultsComponent } from './shakespeare-insults.component';

describe('ShakespeareInsultsComponent', () => {
  let component: ShakespeareInsultsComponent;
  let fixture: ComponentFixture<ShakespeareInsultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShakespeareInsultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShakespeareInsultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
