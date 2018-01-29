/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert         = require('regent-js/lib/util/assert');
const CsrfMiddleware = require('regent-js/lib/http/middleware/csrf');
const HttpRequest    = require('regent-js/lib/http/request');
const HttpResponse   = require('regent-js/lib/http/response');
const HttpKernel     = require('regent-js/lib/http/kernel');

const regent = global.newRegent();
const httpKernel = new HttpKernel(regent);

const CLASS_NAME = CsrfMiddleware.name;

const runBefore = (callback = () => true) => {
    const test = {};
    before(() => {
        test.httpRequest = new HttpRequest(httpKernel, {});
        test.httpResponse = new HttpResponse(httpKernel, {});
        test.csrf = new CsrfMiddleware(
            regent,
            test.httpRequest,
            test.httpResponse,
        );
        return callback();
    });
    return test;
};

describe(`The ${CLASS_NAME} class`, () => {
    describe('setProtected method', () => {
        describe('(<httpMethod>)signature', () => {
            const test = runBefore();
            it('should be case-insensitive', () => {
                test.csrf.setProtected('fOo');
                assert.isTrue(test.csrf.isProtected('FoO'));
            });
            it('should set one HTTP Method as protected', () => {
                test.csrf.setProtected('GET');
                assert.isTrue(test.csrf.isProtected('GET'));
            });
            it('should set many HTTP Methods as protected using spaces', () => {
                test.csrf.setProtected('GET SET BAR');
                assert.isTrue(test.csrf.isProtected('get'));
                assert.isTrue(test.csrf.isProtected('set'));
                assert.isTrue(test.csrf.isProtected('bar'));
            });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.csrf.setProtected('baz'), test.csrf);
            });
        });
        describe('(<httpMethod>, <isProtected>) signature', () => {
            const test = runBefore();
            it('should be case-insensitive', () => {
                test.csrf.setProtected('fOo', true);
                assert.isTrue(test.csrf.isProtected('FoO'));
                test.csrf.setProtected('fOo', false);
                assert.isFalse(test.csrf.isProtected('FoO'));
            });
            it('should set one HTTP Method to the <isProtected> flag', () => {
                test.csrf.setProtected('GET', true);
                assert.isTrue(test.csrf.isProtected('GET'));
                test.csrf.setProtected('GET', false);
                assert.isFalse(test.csrf.isProtected('GET'));
            });
            it(
                'should set many space-delimited methods to <isProtected>',
                () => {
                    test.csrf.setProtected('GET SET BAR', true);
                    assert.isTrue(test.csrf.isProtected('get'));
                    assert.isTrue(test.csrf.isProtected('set'));
                    assert.isTrue(test.csrf.isProtected('bar'));
                    test.csrf.setProtected('GET SET BAR', false);
                    assert.isFalse(test.csrf.isProtected('get'));
                    assert.isFalse(test.csrf.isProtected('set'));
                    assert.isFalse(test.csrf.isProtected('bar'));
                }
            );
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.csrf.setProtected('baz', true), test.csrf);
                assert.equal(test.csrf.setProtected('baz', false), test.csrf);
            });
        });
    });
    describe('isProtected method', () => {
        describe('(<httpMethod>) signature', () => {
            const test = runBefore();
            it('should be case-insensitive', () => {
                test.csrf.setProtected('BaR', true);
                assert.isTrue(test.csrf.isProtected('bAr'));
                test.csrf.setProtected('bAr', false);
                assert.isFalse(test.csrf.isProtected('BaR'));
            });
            it('should return <true> if <httpMethod> is protected', () => {
                test.csrf.setProtected('BAR', true);
                assert.isTrue(test.csrf.isProtected('BAR'));
            });
            it('should return <false> if <httpMethod> is not protected', () => {
                test.csrf.setProtected('bar', false);
                assert.isFalse(test.csrf.isProtected('bar'));
            });
        });
    });
});
