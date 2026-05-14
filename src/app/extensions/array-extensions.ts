/* eslint-disable object-shorthand */

declare global {
interface Array<T> {
    min(fn: (o: T) => number): number;
    max(fn: (o: T) => number): number;
    equals(second: T[]): boolean;
    exists(predicate?: (value: T, index: number, array: T[]) => unknown, thisArg?: unknown): boolean;
    first(predicate?: (value: T, index: number, array: T[]) => unknown, thisArg?: unknown): T;
    last(predicate?: (value: T, index: number, array: T[]) => unknown, thisArg?: unknown): T;
    remove(value: T): number;
    clear(): void;
    distinct(): T[];
    intersect(second: T[]): T[];
    except(second: T[]): T[];
    union(second: T[]): T[];
    sortBy(fn: (o: T) => unknown): void;
}
}

const defaultPredicate = (): unknown => true;

Object.defineProperty(Array.prototype, 'min', {
    value: function <T>(this: Array<T>, fn: (o: T) => number): number {
        return Math.min(...this.map(x => fn.call(undefined, x)));
    }
});

Object.defineProperty(Array.prototype, 'max', {
    value: function <T>(this: Array<T>, fn: (o: T) => number): number {
        return Math.max(...this.map(x => fn.call(undefined, x)));
    }
});

Object.defineProperty(Array.prototype, 'equals', {
    value: function <T>(this: Array<T>, second: Array<T>): boolean {
        return this.length === (second?.length ?? 0) && this.every((val, index) =>
            (val ?? undefined) === (second[index] ?? undefined)
        );
    }
});

Object.defineProperty(Array.prototype, 'exists', {
    value: function <T>(this: Array<T>, predicate?: (value: T, index: number, array: T[]) => unknown, thisArg?: unknown): boolean {
        predicate ||= defaultPredicate;
        return !!this.first(predicate, thisArg);
    }
});

Object.defineProperty(Array.prototype, 'first', {
    value: function <T>(this: Array<T>, predicate?: (value: T, index: number, array: T[]) => unknown, thisArg?: unknown): T {
        predicate ||= defaultPredicate;
        return this.filter(predicate, thisArg)[0];
    }
});

Object.defineProperty(Array.prototype, 'last', {
    value: function <T>(this: Array<T>, predicate?: (value: T, index: number, array: T[]) => unknown, thisArg?: unknown): T {
        predicate ||= defaultPredicate;
        const filtered = this.filter(predicate, thisArg);
        return filtered[Math.max(1, filtered.length) - 1];
    }
});

Object.defineProperty(Array.prototype, 'remove', {
    value: function <T>(this: Array<T>, value: T): number {
        for (let i = 0; i < this.length; i++) {
            if (this[i] === value) {
                this.splice(i, 1);
                i--;
            }
        }
        return this.length;
    }
});

Object.defineProperty(Array.prototype, 'clear', {
    value: function <T>(this: Array<T>): void {
        this.splice(0);
    }
});

Object.defineProperty(Array.prototype, 'distinct', {
    value: function <T>(this: Array<T>): T[] {
        return [...new Set(this)];
    }
});

Object.defineProperty(Array.prototype, 'intersect', {
    value: function <T>(this: Array<T>, second: Array<T>): T[] {
        return this.filter(x => second.indexOf(x) > -1);
    }
});

Object.defineProperty(Array.prototype, 'except', {
    value: function <T>(this: Array<T>, second: Array<T>): T[] {
        return this.filter(x => second.indexOf(x) < 0);
    }
});

Object.defineProperty(Array.prototype, 'union', {
    value: function <T>(this: Array<T>, second: Array<T>): T[] {
        return [...this, ...second].distinct();
    }
});

Object.defineProperty(Array.prototype, 'sortBy', {
    value: function <T>(this: Array<T>, fn: (o: T) => unknown): void {
        const keyed = this.map(value => ({
            key: fn.call(undefined, value),
            value
        }));
        keyed.sort((a, b) => compare(a.key, b.key));
        this.splice(0, this.length, ...keyed.map(x => x.value));
    }
});

const compare = (a: unknown, b: unknown): number => {
    if (a === b) {
        return 0;
    }

    return String(a) < String(b) ? -1 : 1;
};

if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        enumerable: false,
        value: function <T>(this: Array<T>, searchElement: T, fromIndex?: number): boolean {
            return this.indexOf(searchElement, fromIndex) > -1;
        }
    });
}

declare global {
interface ArrayConstructor {
    range(start: number, end: number): number[];
}
}

Array.range = (start: number, end: number) => Array.from({ length: (end - start + 1) }, (v, k) => k + start);

// interface Array<Array<T>> {
//     flatten(): T[];
// }

// Object.defineProperty(Array.prototype, 'flatten', {
//     value: function <T>(this: Array<Array<T>>): T[] {
//         return this.reduce((next, curr) => {
//             next.push(...curr);
//             return next;
//         }, []);
//     }
// });

export {};
