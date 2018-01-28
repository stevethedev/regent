/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert = require('regent-js/lib/util/assert');
const Cookie = require('regent-js/lib/http/cookie');
const regent = global.newRegent();

const CLASS_NAME = Cookie.name;

const runBefore = ({
    callback = () => true,
    name,
} = {}) => {
    const test = { name };
    before(() => {
        test.cookie = new Cookie(regent, name);
        return callback();
    });
    return test;
};

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        describe('(<regent>, <name>) signature', () => {
            it(`should return a ${CLASS_NAME}`, () => {
                assert.instanceOf(new Cookie(regent, 'foo'), Cookie);
            });
            it('should set the name state', () => {
                const cookie = new Cookie(regent, 'foo');
                assert.equal(cookie.name(), 'foo');
            });
        });
    });
    describe('toString method', () => {
        describe('() signature', () => {
            const test = runBefore({ name: 'foo' });
            it('should return a string', () => {
                assert.isString(test.cookie.toString());
            });
        });
    });
    describe('name method', () => {
        describe('() signature', () => {
            const test = runBefore({ name: 'foo' });
            it('should return the name', () => {
                assert.equal(test.cookie.name(), 'foo');
            });
        });
    });
    describe('value method', () => {
        describe('(<value>) signature', () => {
            const test = runBefore({ name: 'foo' });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.cookie.value('bar'), test.cookie);
            });
            it('should set the value', () => {
                test.cookie.value('bar');
                assert.equal(test.cookie.value(), 'bar');
            });
        });
        describe('() signature', () => {
            const test = runBefore({ name: 'foo' });
            it('should return the value', () => {
                test.cookie.value('bar');
                assert.equal(test.cookie.value(), 'bar');
            });
        });
    });
    describe('expires method', () => {
        describe('(<dateTime>) signature', () => {
            const test = runBefore({ name: 'foo' });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.cookie.expires(new Date()), test.cookie);
            });
            it('should set the expiration date', () => {
                const date = new Date();
                test.cookie.expires(date);
                assert.equal(test.cookie.expires().toString(), date.toString());
            });
        });
        describe('() signature', () => {
            const test = runBefore({ name: 'foo' });
            it('should return the expiration date', () => {
                const date = new Date();
                test.cookie.expires(date);
                assert.equal(test.cookie.expires().toString(), date.toString());
            });
        });
    });
    describe('expiresIn method', () => {
        describe('(<seconds>) signature', () => {
            const test = runBefore({ name: 'foo' });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.cookie.expiresIn(1), test.cookie);
            });
            it('should set the expiry time', () => {
                test.cookie.expiresIn(1);
                assert.equal(test.cookie.expiresIn(), 1);
            });
        });
        describe('() signature', () => {
            const test = runBefore({ name: 'foo' });
            it('should return the expiry seconds', () => {
                test.cookie.expiresIn(1);
                assert.equal(test.cookie.expiresIn(), 1);
            });
        });
    });
    describe('path method', () => {
        describe('(<pathValue>) signature', () => {
            const test = runBefore({ name: 'foo' });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.cookie.path('/foo'), test.cookie);
            });
            it('should return the path state', () => {
                test.cookie.path('/foo');
                assert.equal(test.cookie.path(), '/foo');
            });
        });
        describe('() signature', () => {
            const test = runBefore({ name: 'foo' });
            it('should return the path state', () => {
                test.cookie.path('/foo');
                assert.equal(test.cookie.path(), '/foo');
            });
        });
    });
    describe('domain method', () => {
        describe('(<domainValue>) signature', () => {
            const test = runBefore({ name: 'foo' });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.cookie.domain('foo.com'), test.cookie);
            });
            it('should set the domain-value state', () => {
                test.cookie.domain('foo.com');
                assert.equal(test.cookie.domain(), 'foo.com');
            });
        });
        describe('() signature', () => {
            const test = runBefore({ name: 'foo' });
            it('should return the domain state', () => {
                test.cookie.domain('foo.com');
                assert.equal(test.cookie.domain(), 'foo.com');
            });
        });
    });
    describe('isSecure method', () => {
        describe('(<secure>) signature', () => {
            const test = runBefore({ name: 'foo' });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.cookie.isSecure(true), test.cookie);
            });
            it('should ignore the secure-state', () => {
                test.cookie.isSecure(true);
                assert.equal(test.cookie.isSecure(), true);
            });
        });
        describe('() signature', () => {
            const test = runBefore({ name: 'foo' });
            it('should return the secure-state', () => {
                test.cookie.isSecure(true);
                assert.equal(test.cookie.isSecure(), true);
            });
        });
    });
    describe('isHttp method', () => {
        describe('(<httpOnly>) signature', () => {
            const test = runBefore({ name: 'foo' });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.cookie.isHttp(true), test.cookie);
            });
            it('should set the http-only state', () => {
                test.cookie.isHttp(true);
                assert.equal(test.cookie.isHttp(), true);
            });
        });
        describe('() signature', () => {
            const test = runBefore({ name: 'foo' });
            it('should return the http-only state', () => {
                test.cookie.isHttp(true);
                assert.equal(test.cookie.isHttp(), true);
            });
        });
    });
    describe('isSameSite method', () => {
        describe('(<sameSite>) signature', () => {
            const test = runBefore({ name: 'foo' });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.cookie.isSameSite(true), test.cookie);
            });
            it('should set the same-site policy', () => {
                test.cookie.isSameSite(true);
                assert.equal(test.cookie.isSameSite(), true);
                test.cookie.isSameSite(false);
                assert.equal(test.cookie.isSameSite(), false);
            });
        });
        describe('() signature', () => {
            const test = runBefore({ name: 'foo' });
            it('should return the same-site state', () => {
                test.cookie.isSameSite(true);
                assert.equal(test.cookie.isSameSite(), true);
                test.cookie.isSameSite(false);
                assert.equal(test.cookie.isSameSite(), false);
            });
        });
    });
});
