/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert = require('regent-js/lib/util/assert');
const Middleware = require('regent-js/lib/core/middleware/middleware');

const regent = global.newRegent();
const CLASS_NAME = Middleware.name;

const newMiddleware = () => new Middleware(regent);

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor method', () => {
        describe('(regent) signature', () => {
            it(`should return a ${CLASS_NAME} object`, () => {
                assert.instanceOf(new Middleware(regent), Middleware);
            });
        });
    });
    describe('run method', () => {
        describe('(response, request, next) signature', () => {
            it('should cause a Promise to continue', () => {
                const middleware = newMiddleware();
                let ran = false;
                const next = () => {
                    ran = true;
                };
                middleware.run({}, {}, next);
                assert.isTrue(ran);
            });
        });
    });
    describe('terminate method', () => {
        describe('(response, request, next) signature', () => {
            it('should cause a Promise to continue', () => {
                const middleware = newMiddleware();
                let ran = false;
                const next = () => {
                    ran = true;
                };
                middleware.terminate({}, {}, next);
                assert.isTrue(ran);
            });
        });
    });
});
