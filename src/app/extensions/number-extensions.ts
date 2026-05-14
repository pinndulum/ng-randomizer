/* eslint-disable object-shorthand */

declare global {
interface Number {
    padZero(length: number): string;
    between(a: number, b: number): boolean;
}
}

Object.defineProperty(Number.prototype, 'padZero', {
    value: function (this: number, length: number): string {
        return this.toString().padStart(length, '0');
    }
});

Object.defineProperty(Number.prototype, 'between', {
    value: function (this: number, a: number, b: number): boolean {
        const [min, max] = [
            Math.min.apply(Math, [a, b]),
            Math.max.apply(Math, [a, b])
        ];
        return this > min && this < max;
    }
});

export {};
