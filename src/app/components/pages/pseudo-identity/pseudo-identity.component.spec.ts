import { ClipboardModule } from '@angular/cdk/clipboard';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PseudoIdentityComponent } from './pseudo-identity.component';

describe('PseudoIdentityComponent', () => {
  let component: PseudoIdentityComponent;
  let fixture: ComponentFixture<PseudoIdentityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClipboardModule, PseudoIdentityComponent],
      providers: [provideRouter([])]
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
