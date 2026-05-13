import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { AppConfig } from './interfaces/app-config.interface';
import { AlertService } from './services/alert.service';
import { LoadingService } from './services/loading.service';
import { PrefsService } from './services/prefs.service';

const appConfig = new AppConfig({ env: 'development' });

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: AppConfig, useValue: appConfig },
        { provide: AlertService, useValue: { dialogMsgState: () => undefined, showDialogMsg: () => undefined } },
        { provide: LoadingService, useValue: { loadingSub: of(false) } },
        { provide: PrefsService, useValue: { theme$: of('light') } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it("should expose the app title", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Randomizer');
  });
});