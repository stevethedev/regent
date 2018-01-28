/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert = require('regent-js/lib/util/assert');
const Kernel = require('regent-js/lib/core/kernel');
const regent = global.newRegent();

const CLASS_NAME = Kernel.name;

const StartKernel = class extends Kernel {
    start() {
        return this;
    }
};
const StopKernel = class extends StartKernel {
    stop() {
        return this;
    }
};
const newKernel = () => new StopKernel(regent);

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        describe('(<regent>) signature', () => {
            it('should throw if the class has no "start" method', () => {
                assert.throws(() => new Kernel(regent));
            });
            it('should throw if the class has no "stop" method', () => {
                assert.throws(() => new StartKernel(regent));
            });
            it(`should return a ${CLASS_NAME} instance`, () => {
                assert.instanceOf(newKernel(), Kernel);
            });
        });
    });
    describe('getMiddleware method', () => {
        describe('() signature', () => {
            it('should return an array', () => {
                assert.isArray(newKernel().getMiddleware());
            });
        });
    });
    describe('getMiddlewareGroup', () => {
        describe('(<groupName>) signature', () => {
            it('should return an array', () => {
                assert.isArray(newKernel().getMiddlewareGroup('foo'));
            });
        });
        describe('() signature', () => {
            it('should return an array', () => {
                assert.isArray(newKernel().getMiddlewareGroup());
            });
        });
    });
});
