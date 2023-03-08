/* eslint-disable no-case-declarations */

export interface ITime {
    hours: number;
    minutes: number;
    seconds?: number;
    milliseconds?: number;
    timezone?: string;
}

export class Time {
    private time: ITime = { hours: 0, minutes: 0 };

    constructor (time?: string | ITime) {
        if (typeof time === 'string') {
            const regexp = /^(?<h>\d{1,2}):(?<m>\d{1,2}):(?<s>\d{1,2})(?:\.(?<ms>\d{1,3}))?$/g;
            const match = regexp.exec(time);
            if (match?.groups) {
                this.hours = +match.groups['h'];
                this.minutes = +match.groups['m'];
                this.seconds = +match.groups['s'];
                this.milliseconds = +(match.groups['ms'] ?? '0');
            }
        } else {
            time = time ?? { hours: 0, minutes: 0 };
            this.hours = time.hours;
            this.minutes = time.minutes;
            this.seconds = time.seconds ?? 0;
            this.milliseconds = time.milliseconds ?? 0;
        }
    }

    get hours () {
        return this.time.hours;
    }
    set hours (h: number) {
        if (h < 0 || h > 23) {
            throw Error('Invalid hours.');
        }
        this.time.hours = h;
    }

    get minutes () {
        return this.time.minutes;
    }
    set minutes (m: number) {
        if (m < 0 || m > 59) {
            throw Error('Invalid minutes.');
        }
        this.time.minutes = m;
    }

    get seconds () {
        return this.time.seconds ?? 0;
    }
    set seconds (s: number) {
        if (s < 0 || s > 59) {
            throw Error('Invalid seconds.');
        }
        this.time.seconds = s;
    }

    get milliseconds () {
        return this.time.milliseconds ?? 0;
    }
    set milliseconds (ms: number) {
        if (ms < 0 || ms > 999) {
            throw Error('Invalid milliseconds.');
        }
        this.time.milliseconds = ms;
    }

    get timezone (): string | undefined {
        return this.time.timezone;
    }
    set timezone (tz: string | undefined) {
        // todo: verify timezone is valid.
        this.time.timezone = tz;
    }

    toString = (format?: string) => {
        const padnum = (num: number, len: number): string => {
            num = num ?? 0;
            return ('0'.repeat(len) + num).slice(-len);
        };

        let str = `${padnum(this.hours, 2)}:${padnum(this.minutes, 2)}`;
        if (this.seconds || this.milliseconds) {
            str += `:${padnum(this.seconds, 2)}`;
        }
        if (this.milliseconds) {
            str += `.${padnum(this.milliseconds, 3)}`;
        }
        if (this.timezone) {
            str += ` ${this.timezone}`;
        }

        format = (format ?? '').toUpperCase();
        if (format) {
            str = '';
            for (let i = 0; i < format.length; i++) {
                const char = format[i];
                switch (char) {
                case 'H':
                    let hr = `${this.hours}`;
                    if (format[i + 1] === 'H') {
                        hr = padnum(this.hours, 2);
                        i++;
                    }
                    str += hr;
                    break;
                case 'M':
                    let min = `${this.minutes}`;
                    if (format[i + 1] === 'M') {
                        min = padnum(this.minutes, 2);
                        i++;
                    }
                    str += min;
                    break;
                case 'S':
                    let sec = `${this.seconds}`;
                    if (format[i + 1] === 'S') {
                        sec = padnum(this.seconds, 2);
                        i++;
                    }
                    str += sec;
                    break;
                case '.':
                    str += padnum(this.milliseconds, 3);
                    break;
                case 'T':
                    str += this.timezone ?? '';
                    break;
                case '\\':
                    str += format[++i];
                    break;
                default:
                    str += char;
                    break;
                }
            }
        }
        return str;
    };
}
