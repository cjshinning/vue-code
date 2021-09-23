export function isFunction(val) {
    return typeof val === 'function';
}

/**
 * @param {*} val
 * @returns
 */
export function isObject(val) {
    return typeof val === 'object' && val !== null;
}