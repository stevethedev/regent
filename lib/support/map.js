/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert           = require('regent-js/lib/util/assert');
const BaseCollection   = require('regent-js/lib/support/base');
const { $protected }   = require('regent-js/lib/util/scope').create();

const DEFAULT_FUNCTION = (value) => value;
const CONTAINER_CLASS  = Map;

class RegentMap extends BaseCollection {
    constructor(source = {}) {
        super();

        assert.isObject(source);

        const internal = new CONTAINER_CLASS();

        $protected.set(this, { internal });

        this.add(source);
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
        $protected(this).internal.forEach((value, key) => {
            if (this.call(callback, value, key, this)) {
                result.set(key, value);
            }
        });
        return result;
    }

    /**
     * Use an object or RegentMap to fill in the structure
     *
     * @method add
     *
     * @param {Object|RegentMap} source
     *
     * @return {this}
     */
    add(source) {
        if (source instanceof RegentMap) {
            source.forEach((value, key) => this.set(key, value));
        } else {
            Object.keys(source).forEach((key) => this.set(key, source[key]));
        }
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
        return $protected(this).internal.get(key);
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
        const { internal } = $protected(this);
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
        return $protected(this).internal.has(key);
    }

    /**
     * Get each key in the collection
     *
     * @return {Array}
     */
    keys() {
        const keys = [];

        $protected(this).internal.forEach((value, key) => keys.push(key));

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
        $protected(this).internal.forEach((value, key) => {
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
        const lastKey = this.lastKey();
        const lastVal = this.get(lastKey);
        this.delete(lastKey);
        return lastVal;
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
        $protected(this).internal.forEach((value, key) => {
            result = this.call(callback, result, value, key);
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
        $protected(this).internal.set(key, value);
        return this;
    }

    /**
     * Remove and return the first value from the collection
     *
     * @return {mixed}
     */
    shift() {
        const { internal } = $protected(this);
        const firstKey = internal.keys().next().value;
        const value = internal.get(firstKey);
        this.delete(firstKey);
        return value;
    }

    /**
     * Convert the collection into an object
     *
     * @return {Object}
     */
    toObject() {
        const object = {};
        $protected(this).internal.forEach((value, key) => {
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
        $protected(this).internal.forEach(copyValues);
        $protected(this).internal = newInternal;

        return this;
    }
}

module.exports = RegentMap;
