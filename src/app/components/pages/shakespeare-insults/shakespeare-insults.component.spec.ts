import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ShakespeareInsultsComponent } from './shakespeare-insults.component';

describe('ShakespeareInsultsComponent', () => {
  let component: ShakespeareInsultsComponent;
  let fixture: ComponentFixture<ShakespeareInsultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ShakespeareInsultsComponent],
    providers: [provideRouter([])]
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
