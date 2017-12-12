/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert           = requireLib('util/assert');
const RegentCollection = requireLib('support/base');
const { $protected }   = requireLib('util/scope')();

const DEFAULT_FUNCTION = (value) => value;
const CONTAINER_CLASS  = Set;

class RegentSet extends RegentCollection {
    constructor(source = []) {
        super();

        assert.isArray(source);

        const that = $protected(this);

        that.internal = new CONTAINER_CLASS();
        source.forEach((value) => that.internal.add(value));
    }

    /**
     * Keep only records that meet certain criteria
     *
     * @param {Function} callback
     *
     * @return {RegentSet}
     */
    filter(callback = DEFAULT_FUNCTION) {
        const result = new RegentSet();
        $protected(this).internal.forEach((value) => {
            if (this.call(callback, value, value, this)) {
                result.add(value);
            }
        });
        return result;
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
        const result = new RegentSet();
        $protected(this).internal.forEach((value) => {
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
    pop() {
        const lastKey = this.lastKey();
        this.delete(lastKey);
        return lastKey;
    }

    /**
     * Append item(s) to the end of the collection
     *
     * @param {...mixed} values
     *
     * @return {this}
     */
    push(...values) {
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
    reduce(callback = DEFAULT_FUNCTION, initial = null) {
        let result = initial;
        $protected(this).internal.forEach((value) => {
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
    add(value) {
        $protected(this).internal.add(value);
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
        this.delete(firstKey);
        return firstKey;
    }

    /**
     * Insert a value at the front of the collection
     *
     * @param {...mixed} values
     *
     * @return {this}
     */
    unshift(...values) {
        const newInternal = new CONTAINER_CLASS();

        const copyValues = (value) => newInternal.add(value);

        values.forEach(copyValues);
        $protected(this).internal.forEach(copyValues);
        $protected(this).internal = newInternal;

        return this;
    }

    /**
     * Get each value from the collection in consecutive integers
     *
     * @return {RegentSet}
     */
    values() {
        return new RegentSet(super.values());
    }
}

module.exports = RegentSet;
