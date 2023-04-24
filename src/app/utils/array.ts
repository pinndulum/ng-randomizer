import { ndx_sig_of } from '../interfaces/index-signature-of-t.interface';

export const arrayToObj = <T>(array: any[], key: string): ndx_sig_of<T> =>
    array.reduce((obj, item) => ({ ...obj, [item[key]]: item }), {});

export const flatten = <T>(self: T[][]): T[] => {
    return self.reduce((next, curr) => {
        next.push(...curr);
        return next;
    }, []);
};
