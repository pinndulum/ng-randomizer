import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ShakespeareInsultsComponent } from './shakespeare-insults.component';

describe('ShakespeareInsultsComponent', () => {
  let component: ShakespeareInsultsComponent;
  let fixture: ComponentFixture<ShakespeareInsultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ShakespeareInsultsComponent]
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