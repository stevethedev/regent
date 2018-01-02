/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const Mixin = {
    /**
     * Add "AVG(<field>) [AS <alias>]" to the SELECT clause
     *
     * @param {String}  field
     * @param {String=} alias
     *
     * @return {this}
     */
    avg(field, alias = null) {
        return this.call(aggregate, 'AVG', field, alias);
    },

    /**
     * Add "COUNT(<field>) [AS <alias>]" to the SELECT clause
     *
     * @param {String=} field
     * @param {String=} alias
     *
     * @return {this}
     */
    count(field = '*', alias = null) {
        return this.call(aggregate, 'COUNT', field, alias);
    },

    /**
     * Add "MAX(<field>) [AS <alias>]" to the SELECT clause
     *
     * @param {String}  field
     * @param {String=} alias
     *
     * @return {this}
     */
    max(field, alias = null) {
        return this.call(aggregate, 'MAX', field, alias);
    },

    /**
     * Add "MIN(<field>) [AS <alias>]" to the SELECT clause
     *
     * @param {String}  field
     * @param {String=} alias
     *
     * @return {this}
     */
    min(field, alias = null) {
        return this.call(aggregate, 'MIN', field, alias);
    },

    /**
     * Add "SUM(<field>) [AS <alias>]" to the SELECT clause
     *
     * @param {String}  field
     * @param {String=} alias
     *
     * @return {this}
     */
    sum(field, alias = null) {
        return this.call(aggregate, 'SUM', field, alias);
    },
};

/**
 * Create aggregate function signature for the SELECT statement
 *
 * @private
 * @method aggregate
 *
 * @param  {String}  fn
 * @param  {String}  field
 * @param  {String=} alias
 *
 * @return {this}
 */
function aggregate(fn, field, alias) {
    field = `${fn}(${field})`;
    if (alias) {
        return this.select({ [alias]: field });
    }
    return this.select(field);
}

module.exports = function sqlAggregateMixin(QueryBuilder) {
    QueryBuilder.mix(Mixin);
};
