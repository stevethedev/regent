/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert  = require('regent-js/lib/util/assert');
const request = require('request');
const HttpController = require('regent-js/app/http/controller');

const regent = global.newRegent();
const router = regent.getRouter('http');

const HTTP_200 = 200;
const HTTP_403 = 403;

const load = (method, { body = '', cookies = {}, headers = {} } = {}) => {
    return new Promise((resolve, reject) => {
        const url = 'http://localhost:8080';
        const jar = request.jar();

        const options = {
            body,
            headers,
            jar,
            method,
            url,
        };

        for (const pair of Object.entries(cookies)) {
            jar.setCookie(request.cookie(pair.join('=')), url);
        }
        return request(options, (err, res) => {
            return (err) ? reject(err) : resolve(res);
        });
    });
};
load.get = (...args) => load('GET', ...args);
load.post = (...args) => load('POST', ...args);
load.put = (...args) => load('POST', ...args);
load.patch = (...args) => load('POST', ...args);
load.delete = (...args) => load('POST', ...args);

const cookies = (response) => {
    const raw = response.toJSON().headers['set-cookie'];
    const jar = {};

    for (const [ , cookie ] of Object.entries(raw)) {
        const index = cookie.indexOf('=');
        const name = cookie.substring(0, index);
        const data = cookie.substring(1 + index);
        const values = data.split(/;\s*/g);
        jar[name] = {};
        jar[name].value = values.shift();
        jar[name].httpOnly = values.includes('HttpOnly');
        jar[name].sameSite = data.replace(/.*SameSite=([^;]+).*/g, '$1');
    }
    return jar;
};
const headers = (response) => response.toJSON().headers;
const URI = '/';

router.resource(URI, class extends HttpController {
    index() {
        return this.view('index.njk');
    }

    store() {
        return this.view('index.njk');
    }

    update() {
        return this.view('index.njk');
    }

    replace() {
        return this.view('index.njk');
    }

    destroy() {
        return this.view('index.njk');
    }
});

describe('The CSRF Middleware', () => {
    before(() => regent.start());
    after(() => regent.stop());
    describe('GET requests', () => {
        const test = {};
        before(async () => {
            test.response = await load.get();
            test.cookies = cookies(test.response);
            test.headers = headers(test.response);
        });
        it('should add an "X-XSRF-TOKEN" cookie', () => {
            assert.isObject(test.cookies['x-xsrf-token']);
            assert.isString(test.cookies['x-xsrf-token'].value);
            assert.notEqual(test.cookies['x-xsrf-token'].value, '');
        });
        it('should add an "X-CSRF-TOKEN" header', () => {
            assert.isString(test.headers['x-csrf-token']);
            assert.notEqual(test.headers['x-csrf-token'], '');
        });
    });
    describe('POST requests', () => {
        const test = {};
        before(async () => {
            test.gitgot = await load.get();
            test.jar = cookies(test.gitgot);
        });
        it('should fail if no CSRF tokens pass', async () => {
            const result = await load.post();
            assert.equal(result.statusCode, HTTP_403);
        });
        it('should pass if the "X-XSRF-TOKEN" cookie is valid', async () => {
            const result = await load.post({
                cookies: {
                    'sessionid'   : test.jar['sessionid'].value,
                    'x-xsrf-token': test.jar['x-xsrf-token'].value,
                },
            });
            assert.equal(result.statusCode, HTTP_200);
        });
        it('should pass if the "X-CSRF-TOKEN" header is valid', async () => {
            const result = await load.post({
                cookies: { 'sessionid': test.jar['sessionid'].value },
                headers: { 'x-csrf-token': test.jar['x-xsrf-token'].value },
            });
            assert.equal(result.statusCode, HTTP_200);
        });
        it('should pass if the "csrf-token" field is valid', async () => {
            const contentType = 'application/x-www-form-urlencoded';
            const result = await load.post({
                body   : `csrf-token=${test.jar['x-xsrf-token'].value}`,
                cookies: { 'sessionid': test.jar['sessionid'].value },
                headers: { 'content-type': contentType },
            });
            assert.equal(result.statusCode, HTTP_200);
        });
    });
    describe('PUT requests', () => {
        const test = {};
        before(async () => {
            test.gitgot = await load.get();
            test.jar = cookies(test.gitgot);
        });
        it('should fail if no CSRF tokens pass', async () => {
            const result = await load.put();
            assert.equal(result.statusCode, HTTP_403);
        });
        it('should pass if the "X-XSRF-TOKEN" cookie is valid', async () => {
            const result = await load.put({
                cookies: {
                    'sessionid'   : test.jar['sessionid'].value,
                    'x-xsrf-token': test.jar['x-xsrf-token'].value,
                },
            });
            assert.equal(result.statusCode, HTTP_200);
        });
        it('should pass if the "X-CSRF-TOKEN" header is valid', async () => {
            const result = await load.put({
                cookies: { 'sessionid': test.jar['sessionid'].value },
                headers: { 'x-csrf-token': test.jar['x-xsrf-token'].value },
            });
            assert.equal(result.statusCode, HTTP_200);
        });
        it('should pass if the "csrf-token" field is valid', async () => {
            const contentType = 'application/x-www-form-urlencoded';
            const result = await load.put({
                body   : `csrf-token=${test.jar['x-xsrf-token'].value}`,
                cookies: { 'sessionid': test.jar['sessionid'].value },
                headers: { 'content-type': contentType },
            });
            assert.equal(result.statusCode, HTTP_200);
        });
    });
    describe('PATCH requests', () => {
        const test = {};
        before(async () => {
            test.gitgot = await load.get();
            test.jar = cookies(test.gitgot);
        });
        it('should fail if no CSRF tokens pass', async () => {
            const result = await load.patch();
            assert.equal(result.statusCode, HTTP_403);
        });
        it('should pass if the "X-XSRF-TOKEN" cookie is valid', async () => {
            const result = await load.patch({
                cookies: {
                    'sessionid'   : test.jar['sessionid'].value,
                    'x-xsrf-token': test.jar['x-xsrf-token'].value,
                },
            });
            assert.equal(result.statusCode, HTTP_200);
        });
        it('should pass if the "X-CSRF-TOKEN" header is valid', async () => {
            const result = await load.patch({
                cookies: { 'sessionid': test.jar['sessionid'].value },
                headers: { 'x-csrf-token': test.jar['x-xsrf-token'].value },
            });
            assert.equal(result.statusCode, HTTP_200);
        });
        it('should pass if the "csrf-token" field is valid', async () => {
            const contentType = 'application/x-www-form-urlencoded';
            const result = await load.patch({
                body   : `csrf-token=${test.jar['x-xsrf-token'].value}`,
                cookies: { 'sessionid': test.jar['sessionid'].value },
                headers: { 'content-type': contentType },
            });
            assert.equal(result.statusCode, HTTP_200);
        });
    });
    describe('DELETE requests', () => {
        const test = {};
        before(async () => {
            test.gitgot = await load.get();
            test.jar = cookies(test.gitgot);
        });
        it('should fail if no CSRF tokens pass', async () => {
            const result = await load.delete();
            assert.equal(result.statusCode, HTTP_403);
        });
        it('should pass if the "X-XSRF-TOKEN" cookie is valid', async () => {
            const result = await load.delete({
                cookies: {
                    'sessionid'   : test.jar['sessionid'].value,
                    'x-xsrf-token': test.jar['x-xsrf-token'].value,
                },
            });
            assert.equal(result.statusCode, HTTP_200);
        });
        it('should pass if the "X-CSRF-TOKEN" header is valid', async () => {
            const result = await load.delete({
                cookies: { 'sessionid': test.jar['sessionid'].value },
                headers: { 'x-csrf-token': test.jar['x-xsrf-token'].value },
            });
            assert.equal(result.statusCode, HTTP_200);
        });
    });
});
