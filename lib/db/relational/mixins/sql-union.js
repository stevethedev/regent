/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const { $protected } = require('regent-js/lib/util/scope').create();
const { PART_UNION } = require('regent-js/lib/db/relational/parts');

const Mixin = {
    /**
     * Add the QueryBuilder to the UNION clause
     *
     * @method union
     *
     * @param {QueryBuilder} queryBuilder
     *
     * @return {this}
     */
    union(queryBuilder) {
        return this.call(pushUnion, {
            queryBuilder,
            unionAll: false,
        });
    },

    /**
     * Add the QueryBuilder to the UNION ALL clause
     *
     * @method unionAll
     *
     * @param {QueryBuilder} queryBuilder
     *
     * @return {this}
     */
    unionAll(queryBuilder) {
        return this.call(pushUnion, {
            queryBuilder,
            unionAll: true,
        });
    },

    /**
     * Add the String/Values combination to the UNION ALL clause
     *
     * @method unionAllRaw
     *
     * @param {String} signature
     * @param {Array}  [values]
     *
     * @return {this}
     */
    unionAllRaw(signature, values = []) {
        return this.call(pushUnion, {
            signature,
            unionAll: true,
            values,
        });
    },

    /**
     * Add the String/Values combination to the UNION clause
     *
     * @method unionRaw
     *
     * @param {String} signature
     * @param {Array}  values
     *
     * @return {this}
     */
    unionRaw(signature, values = []) {
        return this.call(pushUnion, {
            signature,
            unionAll: false,
            values,
        });
    },
};

function pushUnion(union) {
    $protected(this).parts.get(PART_UNION).push(union);
    return this;
}

module.exports = function sqlUnionMixin(QueryBuilder) {
    QueryBuilder.mix(Mixin);
    QueryBuilder.extend('reset', function(part) {
        if (!part || PART_UNION === part) {
            $protected(this).parts.set(PART_UNION, []);
        }
        return this;
    });
};
