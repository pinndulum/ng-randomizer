export type predicateFn<T> = (value: T, index: number, array: T[]) => boolean;
export type compareFn<T> = (a: T | undefined | null, b: T | undefined | null) => number;
export type equalFn<T> = (a: T | undefined | null, b: T | undefined | null) => boolean;

export const stringComparer = (a: string, b: string): number =>
    (a || b) ? (!a ? -1 : !b ? 1 : a.localeCompare(b)) : 0;
