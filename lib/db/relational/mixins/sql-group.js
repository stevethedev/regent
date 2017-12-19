/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const { $protected } = requireLib('util/scope')();
const { PART_GROUP } = requireLib('db/relational/parts');

const Mixin = {
    /**
     * Add <...fields> to the GROUP BY clause
     *
     * @method groupBy
     *
     * @param {...String} fields
     *
     * @return {this}
     */
    groupBy(...fields) {
        const { dialect } = $protected(this);
        fields.forEach((field) => this.groupByRaw(dialect.field(field)));
        return this;
    },

    /**
     * Add <signature> to the GROUP BY clause
     *
     * @method groupByRaw
     *
     * @param {String} signature
     *
     * @return {this}
     */
    groupByRaw(signature) {
        $protected(this).parts.get(PART_GROUP).push({ signature });
        return this;
    },
};

module.exports = function sqlGroupMixin(QueryBuilder) {
    QueryBuilder.mix(Mixin, (mixin, target) => {
        const { reset } = target;
        target.reset = function(part) {
            if (!part || PART_GROUP === part) {
                $protected(this).parts.set(PART_GROUP, []);
            }
            return this.call(reset, part);
        };
    });
};
