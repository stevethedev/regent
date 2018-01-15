/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject     = require('regent-js/lib/util/base-object');
const { $protected } = require('regent-js/lib/util/scope')();

const DEFAULT_FUNCTION = (value) => value;

class RegentContainer extends BaseObject {
    /**
     * Remove all values
     *
     * @method clear
     *
     * @return {this}
     */
    clear() {
        $protected(this).internal.clear();
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
        return $protected(this).internal.delete(key);
    }

    /**
     * Fire a callback for each key/value pair
     *
     * @param {Function} callback
     *
     * @return {this}
     */
    forEach(callback = DEFAULT_FUNCTION) {
        $protected(this).internal.forEach((value, key) => {
            this.call(callback, value, key, this);
        });
        return this;
    }

    /**
     * Get the number of items in the collection
     *
     * @return {Number}
     */
    size() {
        return $protected(this).internal.size;
    }

    /**
     * Convert the collection into an array
     *
     * @return {Array}
     */
    toArray() {
        const array = [];
        $protected(this).internal.forEach((value) => {
            array.push(value);
        });
        return array;
    }

    /**
     * Get each value from the collection in consecutive integers
     *
     * @return {Array}
     */
    values() {
        const values = [];

        $protected(this).internal.forEach((value) => values.push(value));

        return values;
    }

    /**
     * Get the last key from the collection
     *
     * @method lastKey
     *
     * @return {mixed}
     */
    lastKey() {
        const { internal } = $protected(this);
        let lastKey = null;
        for (const key of internal.keys()) {
            lastKey = key;
        }
        return lastKey;
    }
}

module.exports = RegentContainer;
