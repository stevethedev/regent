/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const { $protected }    = require('regent-js/lib/util/scope').create();
const { PART_DISTINCT } = require('regent-js/lib/db/relational/parts');

const Mixin = {
    /**
     * Enable or disable the DISTINCT keyword on the SELECT clause
     *
     * @param {Boolean} enable
     *
     * @return {this}
     */
    distinct(enable = true) {
        $protected(this).parts.set(PART_DISTINCT, enable);
        return this;
    },
};

module.exports = function sqlDistinctMixin(QueryBuilder) {
    QueryBuilder.mix(Mixin);
    QueryBuilder.extend('reset', function(part) {
        if (!part || PART_DISTINCT === part) {
            $protected(this).parts.set(PART_DISTINCT, false);
        }
        return this;
    });
};
