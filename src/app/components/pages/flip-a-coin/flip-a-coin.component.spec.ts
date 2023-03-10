import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlipACoinComponent } from './flip-a-coin.component';

describe('FlipACoinComponent', () => {
  let component: FlipACoinComponent;
  let fixture: ComponentFixture<FlipACoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlipACoinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlipACoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
