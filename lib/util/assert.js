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

assert.rejects = async (
    val,
    text = `expected ${val} to throw an error in a promise`
) => {
    try {
        await val();
    } catch (error) {
        return true;
    }
    return assert.fail(text);
};

assert.resolveTo = async (
    promise,
    val,
    text,
) => {
    assert.equal(await promise, val, text);
};

module.exports = assert;
