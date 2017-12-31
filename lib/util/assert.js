/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const { assert } = require('chai');

const GeneratorFunction = Object.getPrototypeOf((function* () {
    // Empty function
})()).constructor;

assert.isNumeric = (val, text = `expected ${val} to be numeric`) => {
    return assert.isNumber(Number(val), text);
};

assert.isGenerator = (val, text) => {
    return assert.equal(val.constructor, GeneratorFunction, text);
};

module.exports = assert;
