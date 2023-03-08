import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialogState } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfig } from './interfaces/app-config.interface';
import { AlertService } from './services/alert.service';
import { LoadingService } from './services/loading.service';
import { PrefsService } from './services/prefs.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public readonly title = 'Randomizer';
  public readonly theme$: Observable<string>;
  public readonly loading$: Observable<boolean>;

  constructor(
    private loc: Location,
    private cfg: AppConfig,
    private prefs: PrefsService,
    private alert: AlertService,
    private loading: LoadingService,
    private route: ActivatedRoute
  ) {
    this.theme$ = this.prefs.theme$.pipe(
      map(theme => `rand-${theme}-theme`)
    );
    this.loading$ = this.loading.loadingSub.pipe(
      debounceTime(300)
    );
  }

  ngOnInit(): void {
    this.loc.onUrlChange((url, state) => {
      if (this.cfg.env !== 'production') {
        console.log('route changed:', { url, state });
      }
    });
  }

  componentActive = async (component: Component): Promise<void> => {
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
