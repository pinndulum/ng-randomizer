import { AsyncPipe, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialogState } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { debounceTime, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FooterComponent } from './components/layouts/footer/footer.component';
import { HeaderComponent } from './components/layouts/header/header.component';
import { SidebarComponent } from './components/layouts/sidebar/sidebar.component';
import { AppConfig } from './interfaces/app-config.interface';
import { AlertService } from './services/alert.service';
import { LoadingService } from './services/loading.service';
import { PrefsService } from './services/prefs.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    MatProgressSpinnerModule,
    HeaderComponent,
    SidebarComponent,
    RouterOutlet,
    FooterComponent,
    AsyncPipe
  ]
})
export class AppComponent implements OnInit {
  private readonly loc = inject(Location);
  private readonly cfg = inject(AppConfig);
  private readonly prefs = inject(PrefsService);
  private readonly alert = inject(AlertService);
  private readonly loading = inject(LoadingService);
  private readonly route = inject(ActivatedRoute);

  protected readonly theme$: Observable<string> = this.prefs.theme$.pipe(
    map(theme => `rand-${theme}-theme`)
  );
  protected readonly loading$: Observable<boolean> = this.loading.loadingSub.pipe(
    debounceTime(300)
  );

  ngOnInit(): void {
    this.loc.onUrlChange((url, state) => {
      if (this.cfg.env !== 'production') {
        console.log('route changed:', { url, state });
      }
    });
  }

  protected readonly componentActive = (component: Component): void => {
    if (this.cfg.env !== 'production') {
      console.log('component active:', {
        component: component.constructor.name
      });
    }

    const rt = this.route.firstChild?.snapshot;
    const layout = rt?.data['layout'] ?? 'default';
    if (layout === 'default') {
      if (localStorage.getItem('govWarn') !== 'true') {
        if (this.alert.dialogMsgState('govWarn') !== MatDialogState.OPEN) {
          this.alert.showDialogMsg('govWarn');
          localStorage.setItem('govWarn', 'true');
        }
      }
    } else {
      const classes = window.document.body.classList;
      classes.add(layout);
    }
  };
}
