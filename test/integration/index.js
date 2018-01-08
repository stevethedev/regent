/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert = require('regent/lib/util/assert');
const Regent = require('regent/lib/core/regent');
const { dirname } = require('path');
const { create, start } = require('regent');

const rootDir = dirname(require.resolve('regent'));

describe('The require("regent") response', () => {
    describe('create method', () => {
        it('should return a Regent instance', () => {
            assert.instanceOf(create(rootDir), Regent);
        });
    });
    describe('start method', () => {
        it('should call the Regent::start method', () => {
            const oldStart = Regent.prototype.start;
            let executed = true;
            Regent.prototype.start = () => {
                executed = true;
            };
            start(rootDir);
            Regent.prototype.start = oldStart;
            assert.isTrue(executed);
        });
    });
});
