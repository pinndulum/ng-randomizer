import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export type PrefTheme = 'default' | 'dark' | 'blue';
export interface IPrefs {
    theme: PrefTheme;
}

@Injectable({ providedIn: 'root' })
export class PrefsService {

    public readonly pref$: Observable<IPrefs>;
    public readonly theme$: Observable<PrefTheme>;

    private readonly pref: Subject<IPrefs>;

    constructor (
    ) {
        this.pref = new Subject();
        this.pref$ = this.pref.pipe(
            startWith(this.getPrefs())
        );
        this.theme$ = this.pref$.pipe(
            map(x => x.theme)
        );
    }

    getPrefs = (): IPrefs => {
        let pref: IPrefs = { theme: 'default' };
        const json = sessionStorage.getItem('prefs') ?? '';
        if (json) {
            pref = JSON.parse(json);
        }
        return pref;
    };

    setTheme = async (theme: PrefTheme): Promise<void> => {
        const pref = this.getPrefs();
        if (pref.theme !== theme) {
            pref.theme = theme;
            this.pref.next(pref);
            sessionStorage.removeItem('prefs');
            if (pref.theme !== 'default') {
                sessionStorage.setItem('prefs', JSON.stringify(pref));
            }
        }
    };
}
