export class NestedError extends Error {
    readonly inner: Error[];

    private indent = 0;
    private readonly pad = 2;

    constructor (message?: string, ...inner: unknown[]) {
        super(message);
        this.name = 'NestedError';
        this.inner = (inner ?? []).map(err => {
            const ex = toError(err);
            if (ex instanceof NestedError) {
                ex.indent = this.indent + this.pad;
            }
            return ex;
        });
        this.stack = [
            this.stackstr(this),
            this.inner.map((err, ndx, errors) => {
                let counter = '';
                if (errors.length > 1) {
                    counter = `(${ndx + 1} of ${errors.length}) `;
                }
                return this.stackstr(err, `======= INNER ERROR ${counter}=======\n\n`, this.pad);
            }).join('\n\n')
        ].join('\n\n');
    }

    private stackstr = (err: Error, prefix: string = '', pad: number = 0) => {
        const indent = (str: string) =>
            str.split('\n').map(x => !!x ? ' '.repeat(this.indent + pad) + x : x).join('\n');
        const stack = err.stack ?? `${err.name}: ${err.message}`;
        return indent(prefix) + indent(stack);
    };
}

export const toError = (err: unknown): Error => {
    if (err instanceof Error) {
        return err;
    }

    let [msg, inner]: [string, string?] = ['', undefined];
    switch (typeof err) {
        case 'string':
        case 'undefined':
            msg = err || 'Unknown Error';
            break;
        case 'object':
            msg = `${(err ?? {}).constructor.name} Error`;
            try {
                inner = JSON.stringify(err);
            } catch {
                inner = 'Failed to stringify non-instance of Error that was thrown.\n' +
                    'This is possibly when the object contains a circular reference or is a bigint value.';
            }
            break;
        default:
        case 'number':
        case 'bigint':
        case 'boolean':
        case 'symbol':
        case 'function':
            msg = `${typeof err} Error`;
            try {
                inner = `${err}`;
            } catch {
                inner = 'Failed to stringify non-instance of Error that was thrown.\n' +
                    'This is possibly due to the fact that toString() method of the value\n' +
                    'doesn\'t return a primitive value.';
            }
            break;
    }
    return !inner ? Error(msg) : new NestedError(msg, inner);
};
