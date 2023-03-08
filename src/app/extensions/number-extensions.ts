/* eslint-disable id-blacklist */
/* eslint-disable object-shorthand */

export interface EOpts {
    hide_pos?: boolean; // show exponential sign when positive
    hide_zero?: boolean; // hide coefficient when zero
    prescission?: number; // fractional digits, must be in the range 0-20 (inclusive)
    exponent_digits?: number; // number of exponential digits padded with leading zeros
    upper?: boolean; // return exponential notiation with uppercase E
}

export const exponentialFormat = (value: number, opts?: EOpts) => {
    if (isNaN(value)) {
        return undefined;
    }
    opts = opts ?? { prescission: 2, exponent_digits: 2 };

    let num = value.toExponential(opts.prescission);
    const match = /[+-]?(?<i>\d*)?\.?(?<f>\d+)e(?<s>[+-]?)(?<e>\d+)/i.exec(num);
    if (match?.groups) {
        const sci = {
            sign: value < 0 ? '-' : '',
            integral: match.groups['i'] ?? (opts.hide_zero ? '' : '0'),
            fractional: match.groups['f'],
            exp_sign: match.groups['s'] ?? '+',
            exp_digits: match.groups['e'].padStart(opts.exponent_digits ?? 0, '0')
        };
        if (sci.exp_sign === '+' && opts.hide_pos) {
            sci.exp_sign = '';
        }
        num = `${sci.sign}${sci.integral}.${sci.fractional}e${sci.exp_sign}${sci.exp_digits}`;
    }
    if (opts.upper) {
        num = num.toUpperCase();
    }
    return num;
};

interface Number {
    exponentialFormat(opts?: EOpts): string | undefined;
}

Object.defineProperty(Number.prototype, 'exponentialFormat', {
    value: function (this: number, opts?: EOpts) {
        return exponentialFormat(this, opts);
    }
});
