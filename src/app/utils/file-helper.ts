export const dropTrailingZeros = (size: string): string => size.replace(/\.?0+$/g, '');

export const formattedSize = (file: { size: number }): string | undefined => {
    if (!file) {
        return undefined;
    }

    const threshold = Math.pow(2, 10); // 1024
    const units = [
        'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'
    ];

    let unit = 0;
    let unitsize = file.size ?? 0;
    while (unitsize > threshold - 1) {
        unit++;
        unitsize /= threshold;
    }
    return `${dropTrailingZeros(unitsize.toFixed(2))} ${units[unit]}`;
};

export const join_path = (...segments: string[]): string => {
    let path = '';
    for (let seg of (segments ?? [])) {
        seg = (seg ?? '').replace(/^\/+|\/+$/g, '');
        if (seg) {
            if (path) {
                path += '/';
            }
            path += seg;
        }
    }
    path = path.replace(/\/{2,}/g, '/');
    path = path.replace(/\/[^/]+\/\.{2}\//g, '/');
    path = path.replace(/(http[s]?:)\/+/gi, '$1//');
    return path;
};
