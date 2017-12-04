/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = requireLib('util/assert');
const BaseObject   = requireLib('util/base-object');
const { _private } = requireLib('util/scope')();

const DEFAULT_FUNCTION = (value) => value;
const CONTAINER_CLASS  = Set;

class RegentSet extends BaseObject
{
    constructor(source = [])
    {
        super();

        assert.isArray(source);

        const that = _private(this);

        that.internal = new CONTAINER_CLASS();
        source.forEach((value) => that.internal.add(value));
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
     * @return {RegentSet}
     */
    filter(callback = DEFAULT_FUNCTION)
    {
        const result = new RegentSet();
        _private(this).internal.forEach((value) => {
            if (this.call(callback, value, value, this)) {
                result.add(value);
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
     * Collapse the collection into a string
     *
     * @param {String} [separator=',']
     * 
     * @return {string}
     */
    join(separator = ',')
    {
        return this.toArray().join(separator);
    }

    /**
     * Fire a callback for each key/value pair and return the results
     *
     * @param {Function} callback
     *
     * @return {RegentMap}
     */
    map(callback = DEFAULT_FUNCTION)
    {
        const result = new RegentSet();
        _private(this).internal.forEach((value) => {
            value = this.call(callback, value, value, result);
            result.add(value);
        });
        return result;
    }

    /**
     * Remove and return the last item from the set
     *
     * @return {mixed}
     */
    pop()
    {
        const newInternal = new CONTAINER_CLASS();
        let newSize       = this.size();
        let result;

        _private(this).internal.forEach((value) => {
            if (--newSize > 0) {
                return newInternal.add(value);
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
        values.forEach((value) => this.add(value));
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
     * @param {mixed} value
     *
     * @return {this}
     */
    add(value)
    {
        _private(this).internal.add(value);
        return this;
    }

    /**
     * Remove and return the first value from the collection
     *
     * @return {mixed}
     */
    shift()
    {
        const newInternal = new CONTAINER_CLASS();

        let firstValue = null;
        let gotFirstValue = false;

        _private(this).internal.forEach((value) => {
            if (!gotFirstValue) {
                gotFirstValue = true;
                firstValue = value;
                return;
            }
            newInternal.add(value);
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
     * Convert the collection into an array
     *
     * @return {Array}
     */
    toArray()
    {
        const array = [];
        _private(this).internal.forEach((value) => {
            array.push(value);
        });
        return array;
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
        const newInternal = new CONTAINER_CLASS();

        const copyValues = (value) => newInternal.add(value);

        values.forEach(copyValues);
        _private(this).internal.forEach(copyValues);
        _private(this).internal = newInternal;

        return this;
    }

    /**
     * Get each value from the collection in consecutive integers
     *
     * @return {RegentSet}
     */
    values()
    {
        const values = [];

        _private(this).internal.forEach((value) => values.push(value));

        return new RegentSet(values);
    }
}

module.exports = RegentSet;
