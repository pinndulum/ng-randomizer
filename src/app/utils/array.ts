import { ndx_sig_of } from '../interfaces/index-signature-of-t.interface';

export const arrayToObj = <T extends Record<TKey, PropertyKey>, TKey extends keyof T>(
    array: T[],
    key: TKey
): ndx_sig_of<T> =>
    array.reduce((obj, item) => ({ ...obj, [String(item[key])]: item }), {});

export const flatten = <T>(self: T[][]): T[] => {
    return self.reduce((next, curr) => {
        next.push(...curr);
        return next;
    }, []);
};
