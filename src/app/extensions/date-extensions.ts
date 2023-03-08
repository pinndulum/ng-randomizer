import { isValid, now, today } from '../utils/dates';

interface DateConstructor {
    new(value: number | string | Date): Date;
    today(): number;
    getNow(): Date;
    getToday(): Date;
    isValid(date: Date): boolean;
}

declare let Date: DateConstructor;

Date.today = () => today().valueOf();
Date.getNow = now;
Date.getToday = today;
Date.isValid = (date: Date) => isValid(date);
