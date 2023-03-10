import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PseudoIdentityComponent } from './pseudo-identity.component';

describe('PseudoIdentityComponent', () => {
  let component: PseudoIdentityComponent;
  let fixture: ComponentFixture<PseudoIdentityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PseudoIdentityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PseudoIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
