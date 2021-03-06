/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const { $protected } = require('regent-js/lib/util/scope').create();

/**
 * @private
 *
 * @method getOperatorArray
 *
 * @param {mixed[]} argsArray
 *
 * @return {Object}
 */
function getOperatorArray(argsArray) {
    if (1 === argsArray.length) {
        argsArray.unshift('=');
    }

    const { dialect } = $protected(this);
    const operator    = dialect.operator(argsArray[0]);
    const [ , right ] = argsArray;

    return {
        operator,
        right,
    };
}

module.exports = { getOperatorArray };
