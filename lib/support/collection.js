/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseCollection = require('regent/lib/support/base');
const { $protected } = require('regent/lib/util/scope')();

const DEFAULT_FUNCTION = (value) => value;

class RegentCollection extends BaseCollection {
    constructor(source = []) {
        super();

        const that = $protected(this);

        that.internal = Array.isArray(source) ? source.slice(0) : [];
    }

    /**
     * Remove all values
     *
     * @method clear
     *
     * @return {this}
     */
    clear() {
        $protected(this).internal.length = 0;
        return this;
    }

    /**
     * Remove a key from the collection
     *
     * @param {mixed} key
     *
     * @return {Boolean} Whether the deletion was successful
     */
    delete(key) {
        const length = this.size();
        $protected(this).internal.splice(key, 1);
        return length !== this.size();
    }

    /**
     * Return the first element from the collection
     *
     * @method first
     *
     * @return {Mixed}
     */
    first() {
        return this.get(0);
    }

    /**
     * Return the last element from the collection
     *
     * @method last
     *
     * @return {Mixed}
     */
    last() {
        return this.get(this.size() - 1);
    }

    /**
     * Get the number of items in the collection
     *
     * @return {Number}
     */
    size() {
        return $protected(this).internal.length;
    }

    /**
     * Convert the collection into an array
     *
     * @return {Array}
     */
    toArray() {
        return $protected(this).internal.slice(0);
    }

    /**
     * Get each value from the collection in consecutive integers
     *
     * @return {Array}
     */
    values() {
        return this.toArray();
    }

    /**
     * Get the last key from the collection
     *
     * @method lastKey
     *
     * @return {mixed}
     */
    lastKey() {
        return this.length - 1;
    }

    /**
     * Keep only records that meet certain criteria
     *
     * @param {Function} callback
     *
     * @return {RegentSet}
     */
    filter(callback = DEFAULT_FUNCTION) {
        return new RegentCollection(
            this.toArray().filter(callback)
        );
    }

    /**
     * Check whether the collection has the given key
     *
     * @param {mixed} key
     *
     * @return {Boolean}
     */
    has(key) {
        return $protected(this).internal.length > key;
    }

    /**
     * Collapse the collection into a string
     *
     * @param {String} [separator=',']
     *
     * @return {string}
     */
    join(separator = ',') {
        return this.toArray().join(separator);
    }

    /**
     * Fire a callback for each key/value pair and return the results
     *
     * @param {Function} callback
     *
     * @return {RegentMap}
     */
    map(callback = DEFAULT_FUNCTION) {
        return new RegentCollection(
            this.toArray().map(callback)
        );
    }

    /**
     * Remove and return the last item from the set
     *
     * @return {mixed}
     */
    pop() {
        return $protected(this).internal.pop();
    }

    /**
     * Append item(s) to the end of the collection
     *
     * @param {...mixed} values
     *
     * @return {this}
     */
    push(...values) {
        $protected(this).internal.push(...values);
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
    reduce(callback = DEFAULT_FUNCTION, initial = null) {
        return this.toArray().reduce(callback, initial);
    }

    /**
     * Set the given value at the given key
     *
     * @param {mixed} value
     *
     * @return {this}
     */
    add(value) {
        return this.push(value);
    }

    /**
     * Remove and return the first value from the collection
     *
     * @return {mixed}
     */
    shift() {
        return $protected(this).internal.shift();
    }

    /**
     * Insert a value at the front of the collection
     *
     * @param {...mixed} values
     *
     * @return {this}
     */
    unshift(...values) {
        $protected(this).internal.unshift(...values);
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
        return $protected(this).internal[key];
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
        return this.has(key)
            ? this.get(key)
            : value;
    }

    /**
     * Get each key in the collection
     *
     * @return {Array}
     */
    keys() {
        return Object.keys($protected(this).internal);
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
        $protected(this).internal[key] = value;
        return this;
    }

    /**
     * Convert the collection into an object
     *
     * @return {Object}
     */
    toObject() {
        return { ...this.toArray() };
    }
}

module.exports = RegentCollection;
