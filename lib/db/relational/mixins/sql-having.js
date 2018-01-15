/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const { $protected }  = require('regent-js/lib/util/scope')();
const { getOperatorArray } = require('regent-js/lib/db/relational/utils');
const { PART_HAVING } = require('regent-js/lib/db/relational/parts');

const Mixin = {
    /**
     * Add a HAVING clause to the GROUP BY clause
     *
     * @method having
     *
     * @param {String} field
     * @param {String} [operator='=']
     * @param {Mixed}  value
     *
     * @return {this}
     */
    having(field, ...args) {
        return this.call(commonHaving, field, args, 'AND');
    },

    /**
     * Add a HAVING clause to the GROUP BY clause
     *
     * @method having
     *
     * @param {String}  signature
     * @param {Mixed[]} [values]
     * @param {String}  [joiner]
     *
     * @return {this}
     */
    havingRaw(signature, values = [], joiner = 'AND') {
        $protected(this).parts.get(PART_HAVING).push({
            joiner,
            signature,
            values,
        });
        return this;
    },

    /**
     * Add a HAVING clause to the GROUP BY clause
     *
     * @method having
     *
     * @param {String} field
     * @param {String} [operator='=']
     * @param {Mixed}  value
     *
     * @return {this}
     */
    orHaving(field, ...args) {
        return this.call(commonHaving, field, args, 'OR');
    },

    /**
     * Add a HAVING clause to the GROUP BY clause
     *
     * @method having
     *
     * @param {String}  signature
     * @param {Mixed[]} values
     *
     * @return {this}
     */
    orHavingRaw(signature, values = []) {
        return this.havingRaw(signature, values, 'OR');
    },
};

/**
 * Common constructor for SQL HAVING behavior
 *
 * @private
 * @method commonHaving
 *
 * @param {String}  field
 * @param {Mixed[]} args
 * @param {String}  joiner
 *
 * @return {this}
 */
function commonHaving(field, args, joiner) {
    const { operator, right } = this.call(getOperatorArray, args);
    field = $protected(this).dialect.field(field);
    return this.havingRaw(`${field} ${operator} {0}`, [right], joiner);
}

module.exports = function sqlHavingMixin(QueryBuilder) {
    QueryBuilder.mix(Mixin);
    QueryBuilder.extend('reset', function(part) {
        if (!part || PART_HAVING === part) {
            $protected(this).parts.set(PART_HAVING, []);
        }
        return this;
    });
};
