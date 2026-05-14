import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { AppConfig, IAppConfig } from './app/interfaces/app-config.interface';
import { routes } from './app/routing/routes';
import { NestedError } from './app/utils/nested.error';
import { environment as env } from './environments/environment';
import { AppComponent } from './app/app.component';

const fetchConfig = async (): Promise<IAppConfig> => {
  let envname = 'deploy';
  if (env.name.match(/dev(:elop(:ment)?)?/gi)) {
    envname = 'dev';
  }

  const path = `assets/config/config.${envname}.json`;
  try {
    return await fetch(path)
      .then(res => res.json())
      .then<IAppConfig>(cfg => {
        cfg.env = cfg.env.toLowerCase();
        return cfg;
      });
  } catch (ex) {
    throw new NestedError(`Could not load config file '${path}'`, ex);
  }
};

if (env.name === 'deploy') {
  enableProdMode();
}

fetchConfig().then(config => {
  const appConfig = new AppConfig(config);
  bootstrapApplication(AppComponent, {
    providers: [
      { provide: AppConfig, useValue: appConfig },
      provideRouter(routes),
      importProvidersFrom(BrowserAnimationsModule)
    ]
  })
    .catch(err => console.error(err));
});
