/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const { $protected }    = requireLib('util/scope')();
const { PART_DISTINCT } = requireLib('db/relational/parts');

const Mixin = {
    /**
     * Enable or disable the DISTINCT keyword on the SELECT clause
     *
     * @param {Boolean} enable
     *
     * @return {this}
     */
    distinct(enable = true) {
        const self = $protected(this);
        self.parts.set(PART_DISTINCT, enable);
        return this;
    },
};

module.exports = function sqlDistinctMixin(QueryBuilder) {
    QueryBuilder.mix(Mixin, (mixin, target) => {
        const { reset } = target;
        target.reset = function(part) {
            if (!part || PART_DISTINCT === part) {
                $protected(this).parts.set(PART_DISTINCT, false);
            }
            return this.call(reset, part);
        };
    });
};
