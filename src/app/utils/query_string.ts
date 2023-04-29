export const as_qs = (page: string, params: string | Record<string, string> | string[][] | URLSearchParams) => {
    let path = page || '';
    if (params) {
        const search = new URLSearchParams(params);
        let qs = search.toString();
        if (qs) {
            qs = `?${qs}`;
        }
        path += qs;
    }
    return !!path ? path : undefined;
};

export const location_qs = (params: string[][], path: string = location.pathname) => {
    const search = new URLSearchParams(location.search);
    for (const arg of (params || [])) {
        const [name, value] = arg;
        if (!name) {
            continue;
        }
        if (!value) {
            search.delete(name);
        } else {
            search.set(name, value);
        }
    }
    return as_qs(path, search);
};
