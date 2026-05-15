import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AlertService } from '../../../services/alert.service';

import { ShakespeareInsultsComponent } from './shakespeare-insults.component';

describe('ShakespeareInsultsComponent', () => {
  let component: ShakespeareInsultsComponent;
  let fixture: ComponentFixture<ShakespeareInsultsComponent>;
  const speechApiNames = ['speechSynthesis', 'SpeechSynthesisUtterance'] as const;
  type SpeechApiName = typeof speechApiNames[number];
  let originalSpeechDescriptors: Partial<Record<SpeechApiName, PropertyDescriptor | undefined>>;

  beforeEach(async () => {
    originalSpeechDescriptors = {};
    speechApiNames.forEach(name => {
      originalSpeechDescriptors[name] = Object.getOwnPropertyDescriptor(globalThis, name);
    });

    await TestBed.configureTestingModule({
      imports: [ShakespeareInsultsComponent],
      providers: [
        provideRouter([]),
        { provide: AlertService, useValue: { showDialog: () => Promise.resolve(undefined) } }
      ]
    })
      .compileComponents();
  });

  afterEach(() => {
    speechApiNames.forEach(name => {
      const descriptor = originalSpeechDescriptors[name];
      if (descriptor) {
        Object.defineProperty(globalThis, name, descriptor);
      } else {
        Reflect.deleteProperty(globalThis, name);
      }
    });
  });

  const createComponent = (): void => {
    fixture = TestBed.createComponent(ShakespeareInsultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  const hideSpeechApi = (): void => {
    speechApiNames.forEach(name => {
      const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);
      if (descriptor && !descriptor.configurable) {
        pending(`${name} cannot be overridden in this browser`);
      }

      Object.defineProperty(globalThis, name, {
        configurable: true,
        value: undefined
      });
    });
  };

  it('should create', () => {
    createComponent();

    expect(component).toBeTruthy();
  });

  it('should create when Web Speech API is unavailable', () => {
    hideSpeechApi();
    createComponent();

    expect(component).toBeTruthy();
    expect((component as unknown as { canSpeak: boolean }).canSpeak).toBeFalse();
  });
});
