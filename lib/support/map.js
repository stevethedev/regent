/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = requireLib('util/assert');
const BaseObject   = requireLib('util/base-object');
const { $private } = requireLib('util/scope')();

const DEFAULT_FUNCTION = (value) => value;
const CONTAINER_CLASS  = Map;

class RegentMap extends BaseObject {
    constructor(source = {}) {
        super();

        assert.isObject(source);

        const that = $private(this);

        that.internal = new CONTAINER_CLASS();

        (source instanceof RegentMap)
            ? source.forEach((value, key) => this.set(key, value))
            : Object.keys(source).forEach((key) => this.set(key, source[key]));
    }

    /**
     * Remove all key/value pairs
     *
     * @return {this}
     */
    clear() {
        $private(this).internal.clear();
        return this;
    }

    /**
     * Remove all given keys from the collection
     *
     * @param {mixed} key
     *
     * @return {Boolean} Whether the deletion was successful
     */
    delete(key) {
        return $private(this).internal.delete(key);
    }

    /**
     * Keep only records that meet certain criteria
     *
     * @param {Function} callback
     *
     * @return {RegentMap}
     */
    filter(callback = DEFAULT_FUNCTION) {
        const result = new RegentMap();
        $private(this).internal.forEach((value, key) => {
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
    forEach(callback = DEFAULT_FUNCTION) {
        $private(this).internal.forEach((value, key) => {
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
    get(key) {
        return $private(this).internal.get(key);
    }

    /**
     * Return the value at a given key, or else the default value
     *
     * @param {mixed} key
     * @param {mixed} value
     *
     * @return {mixed}
     */
    getOr(key, value = null) {
        const { internal } = $private(this);
        return internal.has(key)
            ? internal.get(key)
            : value;
    }

    /**
     * Check whether the collection has the given key
     *
     * @param {mixed} key
     *
     * @return {Boolean}
     */
    has(key) {
        return $private(this).internal.has(key);
    }

    /**
     * Get each key in the collection
     *
     * @return {Array}
     */
    keys() {
        const keys = [];

        $private(this).internal.forEach((value, key) => keys.push(key));

        return keys;
    }

    /**
     * Fire a callback for each key/value pair and return the results
     *
     * @param {Function} callback
     *
     * @return {RegentMap}
     */
    map(callback = DEFAULT_FUNCTION) {
        const result = new RegentMap();
        $private(this).internal.forEach((value, key) => {
            value = this.call(callback, value, key, result);
            result.set(key, value);
        });
        return result;
    }

    /**
     * Remove and return the last value added to the RegentMap
     *
     * @return {mixed}
     */
    pop() {
        const newInternal = new CONTAINER_CLASS();
        let newSize = this.size();
        let result  = null;

        $private(this).internal.forEach((value, key) => {
            if (0 < --newSize) {
                return newInternal.set(key, value);
            }
            result = value;
            return null;
        });

        $private(this).internal = newInternal;

        return result;
    }

    /**
     * Append item(s) to the end of the collection
     *
     * @param {mixed} key
     * @param {mixed} value
     *
     * @return {this}
     */
    push(key, value) {
        this.delete(key);
        return this.set(key, value);
    }

    /**
     * Reduce the collection into a single value
     *
     * @param {Function} callback
     * @param {mixed}    initial
     *
     * @return {mixed}
     */
    reduce(callback = DEFAULT_FUNCTION, initial = null) {
        let result = initial;
        $private(this).internal.forEach((value) => {
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
    set(key, value) {
        $private(this).internal.set(key, value);
        return this;
    }

    /**
     * Remove and return the first value from the collection
     *
     * @return {mixed}
     */
    shift() {
        const newInternal = new CONTAINER_CLASS();

        let firstValue = null;
        let gotFirstValue = false;

        $private(this).internal.forEach((value, key) => {
            if (!gotFirstValue) {
                gotFirstValue = true;
                firstValue = value;
                return;
            }
            newInternal.set(key, value);
        });

        $private(this).internal = newInternal;

        return firstValue;
    }

    /**
     * Get the number of items in the collection
     *
     * @return {Number}
     */
    size() {
        return $private(this).internal.size;
    }

    /**
     * Convert the collection into an array
     *
     * @return {Array}
     */
    toArray() {
        const array = [];
        $private(this).internal.forEach((value) => {
            array.push(value);
        });
        return array;
    }

    /**
     * Convert the collection into an object
     *
     * @return {Object}
     */
    toObject() {
        const object = {};
        $private(this).internal.forEach((value, key) => {
            object[key] = value;
        });
        return object;
    }

    /**
     * Insert a value at the front of the collection
     *
     * @param {mixed} key
     * @param {mixed} value
     *
     * @return {this}
     */
    unshift(key, value) {
        const newInternal = new CONTAINER_CLASS();

        const copyValues = (valueCopy, keyCopy) => {
            newInternal.set(keyCopy, valueCopy);
        };

        copyValues(value, key);
        $private(this).internal.forEach(copyValues);
        $private(this).internal = newInternal;

        return this;
    }

    /**
     * Get each value from the collection in consecutive integers
     *
     * @return {Array}
     */
    values() {
        const values = [];

        $private(this).internal.forEach((value) => values.push(value));

        return values;
    }
}

module.exports = RegentMap;

