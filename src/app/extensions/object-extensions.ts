/* eslint-disable object-shorthand */

interface Object {
    isEmptyObj(): boolean;
    isBool(): boolean;
    isNum(): boolean;
}

Object.defineProperty(Object.prototype, 'isEmptyObj', {
    value: function (this: object): boolean {
        return !Object.keys(this).length;
    }
});

Object.defineProperty(Object.prototype, 'isBool', {
    value: function (this: object): boolean {
        const val = (this ?? '').toString().toLowerCase().trim();
        return val === 'true' || val === 'false';
    }
});

Object.defineProperty(Object.prototype, 'isNum', {
    value: function (this: object): boolean {
        return !isNaN(Number(this || 'NaN'));
    }
});
