/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const Mixin = {
    /**
     * Return an array of the bound arguments
     *
     * @method boundArguments
     *
     * @return {Mixed[]}
     */
    boundArguments() {
        return this.compile().bound;
    },

    /**
     * Branch logic based on the truthiness of a condition.
     *
     * @method
     *
     * @param {Mixed}    condition
     * @param {Function} onTrue  - A function to execute if condition is truthy
     * @param {Function} onFalse - A function to execute if condition is falsy
     *
     * @return {this}
     */
    when(condition, onTrue = () => true, onFalse = () => false) {
        this.call(condition ? onTrue : onFalse, this);
        return this;
    },
};

module.exports = function auxiliaryMixin(QueryBuilder) {
    QueryBuilder.mix(Mixin);
};
