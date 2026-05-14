import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AlertService } from '../../../services/alert.service';

import { BuzzWordsComponent } from './buzz-words.component';

describe('BuzzWordsComponent', () => {
  let component: BuzzWordsComponent;
  let fixture: ComponentFixture<BuzzWordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BuzzWordsComponent],
    providers: [
        provideRouter([]),
        { provide: AlertService, useValue: { showDialog: () => Promise.resolve(undefined) } }
    ]
})
      .compileComponents();

    fixture = TestBed.createComponent(BuzzWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
