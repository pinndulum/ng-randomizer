import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuzzWordsComponent } from './buzz-words.component';

describe('BuzzWordsComponent', () => {
  let component: BuzzWordsComponent;
  let fixture: ComponentFixture<BuzzWordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuzzWordsComponent ]
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
