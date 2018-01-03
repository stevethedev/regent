/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const { $protected } = require('regent/lib/util/scope')();
const { PART_ORDER } = require('regent/lib/db/relational/parts');

const RANDOM_ORDER = 'RANDOM()';

const Mixin = {
    /**
     * Add "RANDOM()" to the ORDER BY clause
     *
     * @method inRandomOrder
     *
     * @return {this}
     */
    inRandomOrder() {
        return this.orderByRaw(RANDOM_ORDER);
    },

    /**
     * Add <field> to the ORDER BY clause
     *
     * @method orderBy
     *
     * @param  {String}  field
     * @param  {Boolean} ascending
     *
     * @return {this}
     */
    orderBy(field, ascending = true) {
        field = $protected(this).dialect.field(field);
        return this.orderByRaw(`${field} ${ascending ? 'ASC' : 'DESC'}`);
    },

    /**
     * Add <signature> and <values> to the ORDER BY clause
     *
     * @method orderByRaw
     *
     * @param {String}  signature
     * @param {Mixed[]} values
     *
     * @return {this}
     */
    orderByRaw(signature, values = []) {
        $protected(this).parts.get(PART_ORDER).push({
            signature,
            values,
        });
        return this;
    },
};

module.exports = function sqlGroupMixin(QueryBuilder) {
    QueryBuilder.mix(Mixin);
    QueryBuilder.extend('reset', function(part) {
        if (!part || PART_ORDER === part) {
            $protected(this).parts.set(PART_ORDER, []);
        }
        return this;
    });
};
