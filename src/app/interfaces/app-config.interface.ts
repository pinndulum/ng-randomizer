
export interface IAppConfig {
    env: 'development' | 'acceptance' | 'production';
}

export class AppConfig {
    constructor (private cfg: IAppConfig) {
    }

    get env () {
        return this.cfg.env;
    }
}
