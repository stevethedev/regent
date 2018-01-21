/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const RegentMap        = require('regent-js/lib/support/map');
const { $protected }   = require('regent-js/lib/util/scope').create();

const Mixin = {
    /**
     * Decrement a field and send the request
     *
     * @param {String|Object} field
     * @param {Number|Object} [value]
     * @param {Object}        [values]
     *
     * @return {this}
     */
    decrement(field, value = 1, values = {}) {
        if ('object' !== typeof field) {
            return this.decrement({ [field]: value }, values);
        }

        if (1 === value) {
            value = {};
        }

        const { dialect }  = $protected(this);
        const decrementMap = RegentMap.create(field);
        const valueMap     = RegentMap.create(value);
        const fields       = [];
        const bound        = [];

        decrementMap.forEach((mapValue, mapField) => {
            if (!valueMap.has(mapField)) {
                fields.push(dialect.decrement(bound, mapField, mapValue));
            }
        });

        valueMap.forEach((mapValue, mapField) => {
            fields.push(dialect.assign(bound, mapField, mapValue));
        });

        return this.updateRaw(fields.join(', '), bound);
    },

    /**
     * Increment a field and send the request
     *
     * @param {String|Object} field
     * @param {Number|Object} [value]
     * @param {Object}        [values]
     *
     * @return {Mixed}
     */
    increment(field, value = 1, values = {}) {
        if ('object' !== typeof field) {
            return this.increment({ [field]: value }, values);
        }

        if (1 === value) {
            value = {};
        }

        const { dialect }  = $protected(this);
        const incrementMap = RegentMap.create(field);
        const valueMap     = RegentMap.create(value);
        const fields       = [];
        const bound        = [];

        incrementMap.forEach((mapValue, mapField) => {
            if (!valueMap.has(mapField)) {
                fields.push(dialect.increment(bound, mapField, mapValue));
            }
        });

        valueMap.forEach((mapValue, mapField) => {
            fields.push(dialect.assign(bound, mapField, mapValue));
        });

        return this.updateRaw(fields.join(', '), bound);
    },
};

module.exports = function sqlIncrementMixin(QueryBuilder) {
    QueryBuilder.mix(Mixin);
};
