/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const { assert } = require('chai');

const GeneratorFunction = Object.getPrototypeOf((function* () {
    // Empty function
})()).constructor;

assert.isGenerator = (val, text) => {
    return assert.equal(val.constructor, GeneratorFunction, text);
};

assert.isNumeric = (val, text = `expected ${val} to be numeric`) => {
    return assert.isNumber(Number(val), text);
};

assert.isPromise = (val, text = `expected ${val} to be a Promise`) => {
    return assert.instanceOf(val, Promise, text);
};

module.exports = assert;
