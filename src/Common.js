
export
/**
 * Gets the type of an object.
 *
 * This is a huge hack because Babel seems to have issues with typeof in some cases.
 *
 * @param {*} the thing to get the type of
 * @returns {string} a string which defines the type
 */
function getType(o) {
    if (undefined === o) {
        return 'undefined';
    }
    if (null === o) {
        return 'object';
    }
    if (o === true || o === false) {
        return 'boolean';
    }
    const propertyNames = Object.getOwnPropertyNames(o);
    if (propertyNames.includes('length') && !propertyNames.includes('name')) {
        return 'string';
    }
    // MUST use Number.isNaN, not isNaN
    if (Number.isNaN(o) || !isNaN(Number.parseFloat(o))) {
        // Must go AFTER string
        return 'number';
    }
    if (propertyNames.includes('name') && propertyNames.includes('length')) {
        return 'function';
    }
    return 'object';
}


export
/**
 * Determines if something is a function
 *
 * @param {*} fn the candidate to check
 * @returns {Boolean} true, if fn is a function; false otherwise
 */
function isFunction(fn) {
    return 'function' === getType(fn);
};

export function isObject(o) {
    return 'object' === getType(o);
}
