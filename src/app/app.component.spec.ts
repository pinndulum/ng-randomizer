import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
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
        AppComponent
    ],
    providers: [
        provideRouter([]),
        { provide: AppConfig, useValue: appConfig },
        { provide: AlertService, useValue: { dialogMsgState: () => undefined, showDialogMsg: () => undefined } },
        { provide: LoadingService, useValue: { loadingSub: of(false) } },
        { provide: PrefsService, useValue: { theme$: of('light') } }
    ]
}).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
