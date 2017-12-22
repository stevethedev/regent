/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const { $protected }  = requireLib('util/scope')();
const { PART_HAVING } = requireLib('db/relational/parts');

const Mixin = {
    //
};

module.exports = function sqlHavingMixin(QueryBuilder) {
    QueryBuilder.mix(Mixin, (mixin, target) => {
        const { reset } = target;
        target.reset = function(part) {
            if (!part || PART_HAVING === part) {
                $protected(this).parts.set(PART_HAVING, []);
            }
            return this.call(reset, part);
        };
    });
};
