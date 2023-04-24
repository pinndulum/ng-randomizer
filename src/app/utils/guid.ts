export class Guid {
    static newGuid () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            // eslint-disable-next-line no-bitwise
            const r = Math.random() * 16 | 0; const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static matchGuid (candidate: string): RegExpMatchArray | null {
        return (candidate ?? '').match(/[0-9A-F]{8}-(?:[0-9A-F]{4}-){3}[0-9A-F]{12}/gi);
    }

    static getGuid (candidate: string): string | undefined {
        const match = this.matchGuid(candidate);
        if (match) {
            return match[0];
        }
        return undefined;
    }

    static isGuid (candidate: string): boolean {
        const guid = this.getGuid(candidate) ?? '';
        return !!guid && (candidate ?? '').toLowerCase() === guid.toLowerCase();
    }

    static hasGuid (candidate: string): boolean {
        const guid = this.getGuid(candidate);
        return !!guid;
    }
}
