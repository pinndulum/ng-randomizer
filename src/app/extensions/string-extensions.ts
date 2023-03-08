/* eslint-disable id-blacklist */
/* eslint-disable object-shorthand */

interface String {
    /**
     * Returns a string with the first letter of each word capitalized.
     *
     * @remarks
     * minor words are kept lowercase unless at the first or last of the string.
     * acronym parameters can be used to indicate words that should be fully capitalized,
     * such as initials or abbreviations like ID or TV.
     *
     * @param acronyms - words that to be formatted in upper case.
     * @returns A string formatted as a proper title.
     */
    titleCase(...acronyms: string[]): string;
    toBool(): boolean;
    toNum(dflt?: number): number;
    encRegExp(): string;
    rmNonPrintChars(replaceValue?: string): string;
    uriEncode(): string;
}

Object.defineProperty(String.prototype, 'titleCase', {
    value: function (this: string, ...acronyms: string[]): string {
        let str = this.replace(/([^\W_]+[^\s-]*) */g, txt =>
            txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
        );
        const minors = [
            'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'as', 'at', 'by',
            'for', 'from', 'in', 'into', 'near', 'of', 'on', 'onto', 'to', 'with'
        ];
        for (const word of minors) {
            str = str.replace(new RegExp(`\\s${word}\\s`, 'gi'), txt => txt.toLowerCase());
        }
        acronyms = acronyms ?? [];
        for (const word of acronyms) {
            str = str.replace(new RegExp(`\\b${word}\\b`, 'gi'), word.toUpperCase());
        }
        return str;
    }
});

Object.defineProperty(String.prototype, 'toBool', {
    value: function (this: string): boolean {
        const s = (this ?? '').toLowerCase().trim();
        let b = false;
        switch (s) {
            case 'yes':
            case 'true':
                b = true;
                break;
            default:
                b = isNaN(+s) ? b : +s > 0;
                break;
        }
        return b;
    }
});

Object.defineProperty(String.prototype, 'toNum', {
    value: function (this: string, dflt?: number): number {
        let n = +this.trim();
        if (isNaN(n)) {
            n = dflt ?? 0;
        }
        return n;
    }
});

Object.defineProperty(String.prototype, 'encRegExp', {
    value: function (this: string): string {
        return (this ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
});

Object.defineProperty(String.prototype, 'rmNonPrintChars', {
    value: function (this: string, replaceValue?: string): string {
        return this.replace(/[^ -~]+/g, replaceValue ?? ' ');
    }
});

Object.defineProperty(String.prototype, 'uriEncode', {
    value: function (this: string): string {
        return encodeURIComponent(this ?? '').replace(/[!'()*]/g,
            c => `%${c.charCodeAt(0).toString(16)}`
        );
    }
});

if (!String.prototype.includes) {
    Object.defineProperty(String.prototype, 'includes', {
        value: function (this: string, searchString: string, position?: number): boolean {
            return this.indexOf(searchString, position) > -1;
        }
    });
}
