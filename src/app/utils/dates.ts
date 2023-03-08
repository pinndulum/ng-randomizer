export const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

export const month_abbrvs = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec'
];

export const min = () => new Date(-8640000000000000);
export const max = () => new Date(8640000000000000);
export const now = () => new Date(Date.now());
export const today = () => new Date(now().setHours(0, 0, 0, 0));
export const current = () => {
    const t = today();
    return {
        day: t.getDate(),
        month: {
            ndx: t.getMonth(),
            name: months[t.getMonth()],
            abrev: month_abbrvs[t.getMonth()]
        },
        year: t.getFullYear()
    };
};
export const date_parts = (dt?: string | number | Date): [number, number, number] => {
    const date = (isDate(dt) ? new Date(dt ?? 0) : undefined) as Date;
    return [
        date?.getFullYear(),
        date?.getMonth(),
        date?.getDate()
    ];
};
export const date_parts_equal = (a?: Date, b?: Date) => date_parts(a).equals(date_parts(b));
export const time_parts = (dt?: string | number | Date): [number, number, number, number] => {
    const date = (isDate(dt) ? new Date(dt ?? 0) : undefined) as Date;
    return [
        date?.getHours(),
        date?.getMinutes(),
        date?.getSeconds(),
        date?.getMilliseconds()
    ];
};
export const time_parts_equal = (a?: Date, b?: Date) => time_parts(a).equals(time_parts(b));
export const datetime_parts = (dt?: Date): [number, number, number, number, number, number, number] => [
    ...date_parts(dt),
    ...time_parts(dt)
];
export const datetime_parts_equal = (a?: Date, b?: Date) => datetime_parts(a).equals(datetime_parts(b));

export const addHours = (date: Date, hours: number, minutes?: number, seconds?: number, ms?: number): Date => {
    const result = new Date(date);
    result.setHours(
        result.getHours() + hours,
        result.getMinutes() + (minutes ?? 0),
        result.getSeconds() + (seconds ?? 0),
        result.getMilliseconds() + (ms ?? 0)
    );
    return result;
};
export const addMinutes = (date: Date, minutes: number, seconds?: number, ms?: number): Date => addHours(date, 0, minutes, seconds, ms);
export const addSeconds = (date: Date, seconds: number, ms?: number): Date => addMinutes(date, 0, seconds, ms);
export const addMilSeconds = (date: Date, ms: number): Date => addSeconds(date, 0, ms);

// eslint-disable-next-line @typescript-eslint/no-shadow
export const addYears = (date: Date, years: number, months?: number, days?: number): Date => {
    const result = new Date(date);
    result.setFullYear(
        result.getFullYear() + years,
        result.getMonth() + (months ?? 0),
        result.getDate() + (days ?? 0)
    );
    return result;
};
// eslint-disable-next-line @typescript-eslint/no-shadow
export const addMonths = (date: Date, months: number, days?: number): Date => addYears(date, 0, months, days);
export const addDays = (date: Date, days: number): Date => addMonths(date, 0, days);

export const isValid = (date: number | string | Date) => !isNaN(new Date(date).valueOf());
export const isDate = (date: number | string | Date | undefined): boolean => {
    if (!date) {
        return false;
    }
    if (typeof date === 'string') {
        date = date.replace(/-/g, '/');
    }
    return isValid(date);
};

export const diffTime = (a: Date, b: Date): number => {
    const utc = {
        a: Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()),
        b: Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
    };
    return Math.abs(utc.b - utc.a);
};

export const diffDays = (a: Date, b: Date): number => {
    const dailyMS = 1000 * 60 * 60 * 24;
    return Math.ceil(diffTime(a, b) / dailyMS);
};

export const asYYYYMMDD = (date: Date, sep?: string) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return [year, month, day].join(sep || '-');
};

export const week = (date: Date, firstday?: number): number => {
    firstday = firstday ?? 0;
    firstday = Math.floor(Math.min(Math.max(firstday, 0), 6));
    const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = utc.getUTCDay() || 7;
    utc.setUTCDate(utc.getUTCDate() + 4 - day);
    const onejan = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
    return Math.ceil((((utc.valueOf() - onejan.valueOf()) / 86400000) + onejan.getDay() - firstday) / 7);
};

export const monthIndex = (name: string) => {
    const idx = [...months, ...month_abbrvs]
        .findIndex(x => x.toLowerCase() === name.toLowerCase());
    return idx < 0 ? idx : idx % 12;
};

export default {
    months,
    month_abbrvs,
    min,
    max,
    now,
    today,
    current,
    addHours,
    addMinutes,
    addSeconds,
    addMilSeconds,
    addYears,
    addMonths,
    addDays,
    isValid,
    isDate,
    diffTime,
    diffDays,
    asYYYYMMDD,
    week,
    monthIndex
};
