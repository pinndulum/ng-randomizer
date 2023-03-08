import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { AppConfig, IAppConfig } from './app/interfaces/app-config.interface';
import { NestedError } from './app/utils/nested.error';
import { environment as env } from './environments/environment';

const fetch_cfg = async (): Promise<IAppConfig> => {
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

fetch_cfg().then(x => {
  const cfg = new AppConfig(x);
  platformBrowserDynamic([
    { provide: AppConfig, useValue: cfg }
  ]).bootstrapModule(AppModule)
    .catch(err => console.error(err));
});
