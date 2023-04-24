import { Injectable } from '@angular/core';
// import * as moment from 'moment';
import { Subject, Observable, of, forkJoin, NEVER } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ndx_sig_of } from '../interfaces/index-signature-of-t.interface';

export interface PiUpdate {
	len: number;
	ndx: number;
	tot: number;
	str: string;
	grp?: number;
	sep?: string;
}

export interface PiProgress {
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

    calculate = (len?: number, grp?: number, sep?: string): Observable<PiProgress[]> => {
        if (!len) {
            return NEVER;
        }

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

		// const ts = Date.now();
		// let dur = moment.duration();
		// const refresh_time = () => {
		// 	const ms = Date.now() - ts;
		// 	dur = dur.add(ms);
		// };

		let tot = Math.trunc(len / 9);
        if (len % 9 > 0) {
            tot++;
        }
		return forkJoin(Array.range(0, tot).map(x => of(x).pipe(
			// tap(() => refresh_time()),
			switchMap(ndx => {
				// const ms = Date.now() - ts;
				const digitN = (ndx * 9) + 1;
				return of(Pi.CalcDigits(digitN)).pipe(
					// tap(() => refresh_time()),
					map(str => {
						const nfo = { 
							len, ndx, tot, str, grp, sep
						};
						return update(nfo);
					})
				);
			}),
			tap(x => {
				this.progressSub.next(x);
			})
		)));
    }
}

class Pi {
	static MulMod = (a: number, b: number, m: number): number => {
		return Math.trunc(a * b % m);
	}

	//* return the inverse of x mod y
	static InvMod = (x: number, y: number): number => {
		let [q, u, v, a, c, t] = [0, x, y, 0, 1, 0];
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
	
	//* return the prime number immediatly following n
	static NextPrime = (n: number): number => {
		do {
			n++;
		} while (!Pi.IsPrime(n));
		return n;
	}
	
	// Put a separator between grouped digits
	static GroupDigits = (digits: string, grp?: number, sep: string = ''): string => {
		grp = grp ?? 0;
		if (grp < 1) {
			return digits;
		}
		sep = sep ?? '';
		let result: string = '';
		while(digits.length > grp) {
			result += digits.substring(0, grp) + sep;
			digits = digits.substring(grp, digits.length - grp);
		}
		return result + digits;
	}

    static CalcDigits = (n: number): string => {
		const N = Math.trunc((n + 20) * Math.log(10) / Math.log(2));
		let [av, vmax, num, den, s, t, sum] = [0, 0, 0, 0, 0, 0, 0];
		for(let a = 3; a <= 2*N; a = Pi.NextPrime(a)) {
			av = 1;
			vmax = Math.trunc(Math.log(2*N) / Math.log(a));
			for(let i = 0; i < vmax; i++) {
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
					} while(t % a === 0);
					kq = 0;
				}
				kq++;
				num = Pi.MulMod(num, t, av);
				t = 2 * k -1;
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
					for (let i = v; i < vmax; i++){
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
        /// 2 * (1 + 1/3 * (1 + 2/5 * (1 + 3/7 * (1 + 4/9 * (1 + 5/11 * (…
		return `${2 * Pi.F(1)}`;
	}

	static F = (i: number): number => {
		return 1 + i / (2 * i + 1) * (i < 100 ? Pi.F(i + 1) : 1);
	}
}
