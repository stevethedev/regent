/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert = require('regent-js/lib/util/assert');
const Regent = require('regent-js/lib/core/regent');
const { dirname } = require('path');
const { create, start } = require('regent-js');

const rootDir = dirname(require.resolve('regent-js'));

describe('The require("regent") response', () => {
    describe('create method', () => {
        describe('(<dir>) signature', () => {
            it('should return a Regent instance', () => {
                assert.instanceOf(create(rootDir), Regent);
            });
        });
    });
    describe('start method', () => {
        describe('(<dir>) signature', () => {
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
});
