import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FlipACoinComponent } from './flip-a-coin.component';

describe('FlipACoinComponent', () => {
  let component: FlipACoinComponent;
  let fixture: ComponentFixture<FlipACoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FlipACoinComponent],
    providers: [provideRouter([])]
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
