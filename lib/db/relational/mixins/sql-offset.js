/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const { $protected }  = requireLib('util/scope')();
const { PART_OFFSET } = requireLib('db/relational/parts');

const Mixin = {
    /**
     * Set the OFFSET clause to <count>
     *
     * @method offset
     *
     * @param  {Integer} count
     *
     * @return {this}
     */
    offset(count) {
        $protected(this).parts.set(PART_OFFSET, count);
        return this;
    },

    /**
     * Set the OFFSET clause to <count>
     *
     * @method skip
     *
     * @param {Number} [count=1]
     *
     * @return {this}
     */
    skip(count = 1) {
        return this.offset(count);
    },
};

module.exports = function sqlOffsetMixin(QueryBuilder) {
    QueryBuilder.mix(Mixin);
    QueryBuilder.extend('reset', function(part) {
        if (!part || PART_OFFSET === part) {
            $protected(this).parts.set(PART_OFFSET, null);
        }
        return this;
    });
};
