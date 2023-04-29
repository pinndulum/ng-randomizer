import { ndx_sig_of } from "../interfaces/index-signature-of-t.interface";

export type distanceUnit =
    'meters' |
    'feet' |
    'kilometers' |
    'miles' |
    'yards';
export type areaUnit =
    'acres' |
    'hectares' |
    'square-feet' |
    'square-meters' |
    'square-yards' |
    'square-kilometers' |
    'square-miles';

export interface UnitMeasurement {
    unit: areaUnit | distanceUnit;
    measurement: number;
}

export const isDistanceUnit = (object: any): object is distanceUnit => {
    const units = ['meters', 'feet'];
    return !!object && units.every(x => object.hasOwnProperty(x) && !!object[x]);
}

export const isAreaUnit = (object: any): object is areaUnit => {
    const units = ['acres', 'hectares'];
    return !!object && units.every(x => object.hasOwnProperty(x) && !!object[x]);
}

/**
 * returns an array of the converted quantity and toUnit (in that order). Throws an error is either of the specified units isn't supported
 *
 * @param measurement - the quantity to be converted
 * @param fromUnit - Length unit being converted FROM
 * @param toUnit - Length unit being converted TO
 */
export const convertLengths = (measurement: number, fromUnit: distanceUnit, toUnit: distanceUnit): [number, string] => {
    const factors = {
        meters: 1,
        feet: .3048,
        kilometers: 10 ** 3,
        miles: 1609.3440,
        yards: .9144
    };

    if (factors.hasOwnProperty(fromUnit) && factors.hasOwnProperty(toUnit)) {
        measurement = measurement * factors[fromUnit] / factors[toUnit];
        return [measurement, toUnit];
    } else {
        throw new Error(`unrecognized Length unit specified: ${fromUnit}, ${toUnit}`);
    }
};

/**
 * returns an array of the converted quantity and toUnit (in that order). Throws an error is either of the specified units isn't supported
 *
 * @param measurement - the quantity to be converted
 * @param fromUnit - Area unit being converted FROM
 * @param toUnit - Area unit being converted TO
 */
export const convertAreas = (measurement: number, fromUnit: areaUnit, toUnit: areaUnit): [number, string] => {
    const factors = {
        acres: 4046.86,
        hectares: 10 ** 4,
        'square-feet': .0929,
        'square-meters': 1,
        'square-yards': .8361,
        'square-kilometers': 10 ** 6,
        'square-miles': 2589988.1
    };

    if (factors.hasOwnProperty(fromUnit) && factors.hasOwnProperty(toUnit)) {
        measurement = measurement * factors[fromUnit] / factors[toUnit];
        return [measurement, toUnit];
    } else {
        throw new Error(`unrecognized Area unit specified: ${fromUnit}, ${toUnit}`);
    }
};
