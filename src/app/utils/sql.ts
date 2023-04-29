/**
 * takes a javascript string array and returns a string formatted as a SQL list, such as: ('value1', 'value2', 'value3')
 * wildStart and wildEnd indicate whether each value should start/end with wildcards (%).
 *
 * @param input String Array
 */
export const makeSqlList = (input: string[], wildStart?: boolean, wildEnd?: boolean): string => {
    if (!Array.isArray(input)) {
        throw new Error('makeSqlList was given a non array input');
    }
    const prefix = wildStart ? '%' : '';
    const suffix = wildEnd ? '%' : '';
    const content = input.join(`${suffix}','${prefix}`);
    return `(${prefix}${content}${suffix})`;
};
