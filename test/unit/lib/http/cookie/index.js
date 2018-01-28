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
                assert.equal(cookie.getName(), 'foo');
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
    describe('getName method', () => {
        describe('() signature', () => {
            const test = runBefore({ name: 'foo' });
            it('should return the name', () => {
                assert.equal(test.cookie.getName(), 'foo');
            });
        });
    });
    describe('setValue method', () => {
        describe('(<value>) signature', () => {
            const test = runBefore({ name: 'foo' });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.cookie.setValue('bar'), test.cookie);
            });
            it('should set the value', () => {
                test.cookie.setValue('bar');
                assert.equal(test.cookie.getValue(), 'bar');
            });
        });
    });
    describe('getValue method', () => {
        describe('() signature', () => {
            const test = runBefore({ name: 'foo' });
            it('should return the value', () => {
                test.cookie.setValue('bar');
                assert.equal(test.cookie.getValue(), 'bar');
            });
        });
    });
    describe('setExpiration method', () => {
        describe('(<dateTime>) signature', () => {
            const test = runBefore({ name: 'foo' });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(
                    test.cookie.setExpiration(new Date()),
                    test.cookie,
                );
            });
            it('should set the expiration date', () => {
                const date = new Date();
                test.cookie.setExpiration(date);
                assert.equal(
                    test.cookie.getExpiration().toString(),
                    date.toString()
                );
            });
        });
    });
    describe('getExpiration method', () => {
        describe('() signature', () => {
            const test = runBefore({ name: 'foo' });
            it('should return the expiration date', () => {
                const date = new Date();
                test.cookie.setExpiration(date);
                assert.equal(
                    test.cookie.getExpiration().toString(),
                    date.toString()
                );
            });
        });
    });
    describe('setTimer method', () => {
        describe('(<seconds>) signature', () => {
            const test = runBefore({ name: 'foo' });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.cookie.setTimer(1), test.cookie);
            });
            it('should set the expiry time', () => {
                test.cookie.setTimer(1);
                assert.equal(test.cookie.getTimer(), 1);
            });
        });
    });
    describe('getTimer method', () => {
        describe('() signature', () => {
            const test = runBefore({ name: 'foo' });
            it('should return the expiry seconds', () => {
                test.cookie.setTimer(1);
                assert.equal(test.cookie.getTimer(), 1);
            });
        });
    });
    describe('setPath method', () => {
        describe('(<pathValue>) signature', () => {
            const test = runBefore({ name: 'foo' });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.cookie.setPath('/foo'), test.cookie);
            });
            it('should return the path state', () => {
                test.cookie.setPath('/foo');
                assert.equal(test.cookie.getPath(), '/foo');
            });
        });
    });
    describe('getPath method', () => {
        describe('() signature', () => {
            const test = runBefore({ name: 'foo' });
            it('should return the path state', () => {
                test.cookie.setPath('/foo');
                assert.equal(test.cookie.getPath(), '/foo');
            });
        });
    });
    describe('setDomain method', () => {
        describe('(<domainValue>) signature', () => {
            const test = runBefore({ name: 'foo' });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.cookie.setDomain('foo.com'), test.cookie);
            });
            it('should set the domain-value state', () => {
                test.cookie.setDomain('foo.com');
                assert.equal(test.cookie.getDomain(), 'foo.com');
            });
        });
    });
    describe('getDomain method', () => {
        describe('() signature', () => {
            const test = runBefore({ name: 'foo' });
            it('should return the domain state', () => {
                test.cookie.setDomain('foo.com');
                assert.equal(test.cookie.getDomain(), 'foo.com');
            });
        });
    });
    describe('setSecure method', () => {
        describe('(<secure>) signature', () => {
            const test = runBefore({ name: 'foo' });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.cookie.setSecure(true), test.cookie);
            });
            it('should ignore the secure-state', () => {
                test.cookie.setSecure(true);
                assert.equal(test.cookie.isSecure(), true);
            });
        });
    });
    describe('isSecure method', () => {
        describe('() signature', () => {
            const test = runBefore({ name: 'foo' });
            it('should return the secure-state', () => {
                test.cookie.setSecure(true);
                assert.equal(test.cookie.isSecure(), true);
            });
        });
    });
    describe('setHttp method', () => {
        describe('(<httpOnly>) signature', () => {
            const test = runBefore({ name: 'foo' });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.cookie.setHttp(true), test.cookie);
            });
            it('should set the http-only state', () => {
                test.cookie.setHttp(true);
                assert.equal(test.cookie.isHttp(), true);
            });
        });
    });
    describe('isHttp method', () => {
        describe('() signature', () => {
            const test = runBefore({ name: 'foo' });
            it('should return the http-only state', () => {
                test.cookie.setHttp(true);
                assert.equal(test.cookie.isHttp(), true);
            });
        });
    });
    describe('setSameSite method', () => {
        describe('(<sameSite>) signature', () => {
            const test = runBefore({ name: 'foo' });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.cookie.setSameSite(true), test.cookie);
            });
            it('should set the same-site policy', () => {
                test.cookie.setSameSite(true);
                assert.equal(test.cookie.isSameSite(), true);
                test.cookie.setSameSite(false);
                assert.equal(test.cookie.isSameSite(), false);
            });
        });
    });
    describe('isSameSite method', () => {
        describe('() signature', () => {
            const test = runBefore({ name: 'foo' });
            it('should return the same-site state', () => {
                test.cookie.setSameSite(true);
                assert.equal(test.cookie.isSameSite(), true);
                test.cookie.setSameSite(false);
                assert.equal(test.cookie.isSameSite(), false);
            });
        });
    });
});
