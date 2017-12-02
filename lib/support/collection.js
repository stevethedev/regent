/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert     = requireLib('util/assert');
const BaseObject = requireLib('util/base-object');
const { _private } = requireLib('util/scope')();

const DEFAULT_FUNCTION = (value) => value;

class Collection extends BaseObject
{
    constructor(source = {})
    {
        super();

        if (!Array.isArray(source)) {
            assert.isObject(source);
        }

        const that = _private(this);

        that.internal = new Map();

        Array.isArray(source)
            ? source.forEach((value, key) => this.set(key, value))
            : Object.keys(source).forEach((key) => this.set(key, source[key]))
        ;
    }

    /**
     * Remove all key/value pairs
     *
     * @return {this}
     */
    clear()
    {
        _private(this).internal.clear();
        return this;
    }

    /**
     * Remove all given keys from the collection
     *
     * @param {mixed} key
     *
     * @return {Boolean} Whether the deletion was successful
     */
    delete(key)
    {
        return _private(this).internal.delete(key);
    }

    /**
     * Keep only records that meet certain criteria
     *
     * @param {Function} callback
     *
     * @return {Collection}
     */
    filter(callback = DEFAULT_FUNCTION)
    {
        const result = new Collection();
        _private(this).internal.forEach((value, key) => {
            if (this.call(callback, value, key, this)) {
                result.set(key, value);
            }
        });
        return result;
    }

    /**
     * Fire a callback for each key/value pair
     *
     * @param {Function} callback
     *
     * @return {this}
     */
    forEach(callback = DEFAULT_FUNCTION)
    {
        _private(this).internal.forEach((value, key) => {
            this.call(callback, value, key, this);
        });
        return this;
    }

    /**
     * Return the value at a given key
     *
     * @param {mixed} key
     *
     * @return {mixed}
     */
    get(key)
    {
        return _private(this).internal.get(key);
    }

    /**
     * Check whether the collection has the given key
     *
     * @param {mixed} key
     *
     * @return {Boolean}
     */
    has(key)
    {
        return _private(this).internal.has(key);
    }

    /**
     * Get each key in the collection
     *
     * @return {Collection}
     */
    keys()
    {
        const keys = [];

        _private(this).internal.forEach((value, key) => keys.push(key));

        return new Collection(keys);
    }

    /**
     * Fire a callback for each key/value pair and return the results
     *
     * @param {Function} callback
     *
     * @return {Collection}
     */
    map(callback = DEFAULT_FUNCTION)
    {
        const result = new Collection();
        _private(this).internal.forEach((value, key) => {
            value = this.call(callback, value, key, result);
            result.set(key, value);
        });
        return result;
    }

    pop()
    {
        const newInternal = new Map();
        let newSize       = this.size();
        let result;

        _private(this).internal.forEach((value, key) => {
            if (--newSize > 0) {
                return newInternal.set(key, value);
            }
            result = value;
        });

        _private(this).internal = newInternal;

        return result;
    }

    /**
     * Append item(s) to the end of the collection
     *
     * @param {...mixed} values
     *
     * @return {this}
     */
    push(...values)
    {
        values.forEach((value) => {
            this.set(this.size(), value);
        });
        return this;
    }

    /**
     * Reduce the collection into a single value
     *
     * @param {Function} callback
     * @param {mixed}    initial
     *
     * @return {mixed}
     */
    reduce(callback = DEFAULT_FUNCTION, initial = null)
    {
        let result = initial;
        _private(this).internal.forEach((value) => {
            result = this.call(callback, result, value);
        });
        return result;
    }

    /**
     * Set the given value at the given key
     *
     * @param {mixed} key
     * @param {mixed} value
     *
     * @return {this}
     */
    set(key, value)
    {
        _private(this).internal.set(key, value);
        return this;
    }

    /**
     * Remove and return the first value from the collection
     *
     * @return {mixed}
     */
    shift()
    {
        const newInternal = new Map();

        let firstValue = null;
        let gotFirstValue = false;

        _private(this).internal.forEach((value, key) => {
            if (!gotFirstValue) {
                gotFirstValue = true;
                firstValue = value;
                return;
            }
            newInternal.set(key, value);
        });

        _private(this).internal = newInternal;

        return firstValue;
    }

    /**
     * Get the number of items in the collection
     *
     * @return {Number}
     */
    size()
    {
        return _private(this).internal.size;
    }

    /**
     * Insert a value at the front of the collection
     *
     * @param {...mixed} values
     *
     * @return {this}
     */
    unshift(...values)
    {
        const newInternal = new Map();

        const copyValues = (value, key) => newInternal.set(key, value);

        values.forEach(copyValues);
        _private(this).internal.forEach(copyValues);
        _private(this).internal = newInternal;

        return this;
    }

    /**
     * Get each value from the collection in consecutive integers
     *
     * @return {Collection}
     */
    values()
    {
        const values = [];

        _private(this).internal.forEach((value) => values.push(value));

        return new Collection(values);
    }
}

module.exports = Collection;