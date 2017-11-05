/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert = require('chai').assert;

assert.isNumeric = (val, text = `expected ${val} to be numeric`) => {
    assert.isNumber(+val, text);
};

module.exports = assert;
