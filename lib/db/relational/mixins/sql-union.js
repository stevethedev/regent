/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const { $protected } = requireLib('util/scope')();
const { PART_UNION } = requireLib('db/relational/parts');

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
        queryBuilder;
        return this;
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
        queryBuilder;
        return this;
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
        values;
        return this;
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
        values;
        return this;
    },
};

module.exports = function sqlUnionMixin(QueryBuilder) {
    QueryBuilder.mix(Mixin, (mixin, target) => {
        const { reset } = target;
        target.reset = function(part) {
            if (!part || PART_UNION === part) {
                $protected(this).parts.set(PART_UNION, []);
            }
            return this.call(reset, part);
        };
    });
};
