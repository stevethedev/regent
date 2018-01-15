/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const { $protected }  = require('regent-js/lib/util/scope')();
const { PART_LIMIT } = require('regent-js/lib/db/relational/parts');

const Mixin = {
    /**
     * Set the LIMIT clause to <count>
     *
     * @method limit
     *
     * @param {Integer} count
     *
     * @return {this}
     */
    limit(count) {
        $protected(this).parts.set(PART_LIMIT, count);
        return this;
    },

    /**
     * Set the LIMIT clause to <count>
     *
     * @method take
     *
     * @param {Integer} [count=1]
     *
     * @return {this}
     */
    take(count = 1) {
        return this.limit(count);
    },
};

module.exports = function sqlLimitMixin(QueryBuilder) {
    QueryBuilder.mix(Mixin);
    QueryBuilder.extend('reset', function(part) {
        if (!part || PART_LIMIT === part) {
            $protected(this).parts.set(PART_LIMIT, null);
        }
        return this;
    });
};
