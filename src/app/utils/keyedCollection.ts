// Dictionary implementation for typescript. Initially copied from
// http://www.dustinhorne.com/post/2016/06/09/implementing-a-dictionary-in-typescript

export interface IKeyedCollection<T> {
    item(key: string): T;
    keys(): string[];
    values(): T[];
    count(): number;
    keyDefined(key: string): boolean;
    containsKey(key: string): boolean;
    add(key: string, value: T): void;
    addRange(...items: { key: string; value: T }[]): void;
    remove(key: string): T;
    clear(): void;
}

export class KeyedCollection<T> implements IKeyedCollection<T> {
    private items: { [index: string]: T } = {};

    public item = (key: string): T => this.items[key];
    public keys = (): string[] => Object.keys(this.items);
    public values = (): T[] => Object.values(this.items);
    public count = (): number => this.keys().length;
    public keyDefined = (key: string): boolean => !!this.items[key];
    public containsKey = (key: string): boolean => this.items.hasOwnProperty(key);

    public add = (key: string, value: T): T => {
        if (key?.length) {
            this.items[key] = value;
        }
        return this.item(key);
    };

    public addRange = (...items: { key: string; value: T }[]): T[] => {
        for (const item of (items ?? [])) {
            this.add(item.key, item.value);
        }
        return this.values();
    };

    public remove = (key: string): T => {
        const val = this.item(key);
        delete this.items[key];
        return val;
    };

    public clear = (): void => {
        this.items = {};
    };
}
