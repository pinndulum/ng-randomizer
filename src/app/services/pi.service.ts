import { Injectable } from '@angular/core';
import { from, NEVER, Observable, Subject, timer } from 'rxjs';
import { concatMap, map, tap, toArray } from 'rxjs/operators';
import { ndx_sig_of } from '../interfaces/index-signature-of-t.interface';

export type PiFormula = 'bellard-nth-digit' | 'rabinowitz-wagon-spigot';

export const DEFAULT_PI_FORMULA: PiFormula = 'bellard-nth-digit';

export interface PiFormulaOption {
    value: PiFormula;
    label: string;
    description: string;
    expression: string;
    postExpressionText?: string;
    maxPrecision: number;
}

export const PI_FORMULA_OPTIONS: readonly PiFormulaOption[] = [
    {
        value: 'bellard-nth-digit',
        label: 'Bellard Nth-Digit Algorithm',
        description: 'Modular arithmetic against a Lehmer central-binomial-coefficient series.',
        expression: 'Bellard nth-digit method over Lehmer central-binomial-coefficient series',
        maxPrecision: 1800
    },
    {
        value: 'rabinowitz-wagon-spigot',
        label: 'Rabinowitz-Wagon Spigot Formula',
        description: 'A compact nested formula that demonstrates spigot-style convergence.',
        expression: '2 * (1 + 1/3 * (1 + 2/5 * (1 + 3/7 * (1 + 4/9 * (1 + 5/11 * (...',
        postExpressionText: 'In perpetuity, or whenever you give up.',
        maxPrecision: 15
    }
] as const;

export interface PiUpdate {
    len: number;
    ndx: number;
    tot: number;
    str: string;
    formula: PiFormula;
    grp?: number;
    sep?: string;
}

export interface PiProgress extends PiUpdate {
    message: string;
    content: { len: number; str: string };
}

@Injectable({
    providedIn: 'root'
})
export class PiService {
    private readonly progressSub: Subject<PiProgress> = new Subject<PiProgress>();

    progress = (): Observable<PiProgress> =>
        this.progressSub.asObservable();

    calculate = (
        len?: number,
        grp?: number,
        sep?: string,
        formula: PiFormula = DEFAULT_PI_FORMULA
    ): Observable<PiProgress[]> => {
        if (!len) {
            return NEVER;
        }

        if (formula === 'rabinowitz-wagon-spigot') {
            return this.calculateRabinowitzWagon(len, grp, sep);
        }

        return this.calculateBellard(len, grp, sep);
    }

    private calculateBellard(len: number, grp?: number, sep?: string): Observable<PiProgress[]> {
        const pi_parts: ndx_sig_of<string> = {};
        const pi_str = (len: number, grp?: number, sep?: string) => {
            const obj = {...pi_parts};
            const keys = Object.keys(obj);
            const parts = keys.sort(k => +k).map(k => obj[k]);
            const content = parts.join('').substring(0, len);
            return {
                len: content.length,
                str: '3.' + Pi.GroupDigits(content, grp, sep)
            };
        };

        const update = (nfo: PiUpdate): PiProgress => {
            if (pi_parts[nfo.ndx] !== nfo.str) {
                pi_parts[nfo.ndx] = nfo.str;
            }
            const content = pi_str(nfo.len, nfo.grp, nfo.sep);
            const pct = ((content.len / nfo.len) * 100).toFixed(2);
            return {
                ...nfo, content,
                message: `Finished ${content.len} digits of ${nfo.len} - ${pct}%`
            };
        };

        let tot = Math.trunc(len / 9);
        if (len % 9 > 0) {
            tot++;
        }
        return from(Array.range(0, tot - 1)).pipe(
            concatMap(ndx => timer(0).pipe(
                map(() => {
                    const digitN = (ndx * 9) + 1;
                    const str = Pi.CalcDigits(digitN);
                    const nfo = {
                        len,
                        ndx,
                        tot,
                        str,
                        grp,
                        sep,
                        formula: DEFAULT_PI_FORMULA
                    };
                    return update(nfo);
                }),
                tap(x => {
                    this.progressSub.next(x);
                })
            )),
            toArray()
        );
    }

    private calculateRabinowitzWagon(len: number, grp?: number, sep?: string): Observable<PiProgress[]> {
        const maxPrecision = this.maxPrecisionFor('rabinowitz-wagon-spigot');
        const targetLen = Math.min(len, maxPrecision);

        return timer(0).pipe(
            map(() => {
                const raw = Pi.CalcF();
                const digits = raw.split('.')[1] ?? '';
                const contentDigits = digits.substring(0, targetLen);
                const content = {
                    len: contentDigits.length,
                    str: '3.' + Pi.GroupDigits(contentDigits, grp, sep)
                };

                return {
                    len: targetLen,
                    ndx: 0,
                    tot: 1,
                    str: raw,
                    grp,
                    sep,
                    formula: 'rabinowitz-wagon-spigot',
                    content,
                    message: `Finished ${content.len} digits of ${targetLen} - 100.00%`
                } satisfies PiProgress;
            }),
            tap(x => {
                this.progressSub.next(x);
            }),
            map(progress => [progress])
        );
    }

    private maxPrecisionFor(formula: PiFormula): number {
        return PI_FORMULA_OPTIONS.find(option => option.value === formula)?.maxPrecision ?? 15;
    }
}

class Pi {
    static MulMod = (a: number, b: number, m: number): number =>
        Math.trunc(a * b % m);

    //* return the inverse of x mod y
    static InvMod = (x: number, y: number): number => {
        let [u, v, a, c] = [x, y, 0, 1];
        let q: number;
        let t: number;
        do {
            q = Math.trunc(v / u);
            t = c;
            c = a - q * c;
            a = t;
            t = u;
            u = v - q * u;
            v = t;
        } while (u !== 0);
        a = a % y;
        if (a < 0) {
            a = y + a;
        }
        return a;
    }

    //* return (a^b) mod m
    static PowMod = (a: number, b: number, m: number): number => {
        let [r, aa] = [1, a];
        while (true) {
            if ((b & 1) !== 0) {
                r = Pi.MulMod(r, aa, m);
            }
            b = b >> 1;
            if (b === 0) {
                break;
            }
            aa = Pi.MulMod(aa, aa, m);
        }
        return r;
    }

    //* return true if n is prime
    static IsPrime = (n: number): boolean => {
        if (n % 2 === 0) {
            return false;
        }
        const sqrt = Math.trunc(Math.sqrt(n));
        for (let i = 3; i <= sqrt; i += 2) {
            if (n % i === 0) {
                return false;
            }
        }
        return true;
    }

    //* return the prime number immediately following n
    static NextPrime = (n: number): number => {
        do {
            n++;
        } while (!Pi.IsPrime(n));
        return n;
    }

    // Put a separator between grouped digits
    static GroupDigits = (digits: string, grp?: number, sep: string = ''): string => {
        grp ??= 0;
        if (grp < 1) {
            return digits;
        }
        sep ??= '';
        let result = '';
        while (digits.length > grp) {
            result += digits.substring(0, grp) + sep;
            digits = digits.substring(grp);
        }
        return result + digits;
    }

    static CalcDigits = (n: number): string => {
        const N = Math.trunc((n + 20) * Math.log(10) / Math.log(2));
        let sum = 0;
        let av: number;
        let vmax: number;
        let num: number;
        let den: number;
        let s: number;
        let t: number;
        for (let a = 3; a <= 2 * N; a = Pi.NextPrime(a)) {
            av = 1;
            vmax = Math.trunc(Math.log(2 * N) / Math.log(a));
            for (let i = 0; i < vmax; i++) {
                av = av * a;
            }
            s = 0;
            num = den = 1;
            let [v, kq, kq2] = [0, 1, 1];
            for (let k = 1; k <= N; k++) {
                t = k;
                if (kq >= a) {
                    do {
                        t = t / a;
                        v--;
                    } while (t % a === 0);
                    kq = 0;
                }
                kq++;
                num = Pi.MulMod(num, t, av);
                t = 2 * k - 1;
                if (kq2 >= a) {
                    if (kq2 === a) {
                        do {
                            t = t / a;
                            v++;
                        } while (t % a === 0);
                    }
                    kq2 -= a;
                }
                den = Pi.MulMod(den, t, av);
                kq2 += 2;
                if (v > 0) {
                    t = Pi.InvMod(den, av);
                    t = Pi.MulMod(t, num, av);
                    t = Pi.MulMod(t, k, av);
                    for (let i = v; i < vmax; i++) {
                        t = Pi.MulMod(t, a, av);
                    }
                    s += t;
                    if (s >= av) {
                        s -= av;
                    }
                }
            }
            t = Pi.PowMod(10, n - 1, av);
            s = Pi.MulMod(s, t, av);
            sum = (sum + s / av) % 1.0;
        }
        return `${Math.trunc(sum * 1e9)}`.padStart(9, '0');
    }

    static CalcF = (): string => {
        // 2 * (1 + 1/3 * (1 + 2/5 * (1 + 3/7 * (1 + 4/9 * (1 + 5/11 * ...
        return `${2 * Pi.F(1)}`;
    }

    static F = (i: number): number =>
        1 + i / (2 * i + 1) * (i < 100 ? Pi.F(i + 1) : 1);
}
