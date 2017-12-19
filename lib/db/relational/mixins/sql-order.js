/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const { $protected } = requireLib('util/scope')();
const { PART_ORDER } = requireLib('db/relational/parts');

const Mixin = {
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
    orderByRaw(signature, values) {
        $protected(this).parts.get(PART_ORDER).push({
            signature,
            values,
        });
        return this;
    },
};

module.exports = function sqlOffsetMixin(QueryBuilder) {
    QueryBuilder.mix(Mixin, (mixin, target) => {
        const { reset } = target;
        target.reset = function(part) {
            if (!part || PART_ORDER === part) {
                $protected(this).parts.set(PART_ORDER, []);
            }
            return this.call(reset, part);
        };
    });
};
