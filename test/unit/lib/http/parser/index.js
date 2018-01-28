/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert     = require('regent-js/lib/util/assert');
const FileSystem = require('regent-js/lib/file/file-system');
const fs         = require('fs');
const Parser     = require('regent-js/lib/http/parser');
const path       = require('path');

const opt    = { Directories: { var: path.join(__dirname, 'storage') } };
const regent = global.newRegent(opt);
const fileSystem = new FileSystem(regent, opt.Directories.var);

const contentTypes = {
    form     : 'application/x-www-form-urlencoded',
    json     : 'application/json',
    multipart: 'multipart/form-data',
    text     : 'text/data',
};

const newParser = ({ type = 'text', body = '', encoding } = {}) => {
    if ('json' === type) {
        body = JSON.stringify(body);
    }
    if ('form' === type) {
        const parts = [];
        for (const pair of Object.entries(body)) {
            parts.push(pair.join('='));
        }
        body = parts.join('&');
    }
    if (contentTypes[type]) {
        type = contentTypes[type];
    }
    return new Parser(type, body, fileSystem, encoding);
};

const CLASS_NAME = Parser.name;

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        describe(
            '(<contentType>, <body>, <fileSystem>, <encoding>) signature',
            () => {
                it(`should return a ${CLASS_NAME} instance`, () => {
                    assert.instanceOf(
                        newParser({ encoding: 'utf8' }),
                        Parser
                    );
                });
            }
        );
        describe('(<contentType>, <body>, <fileSystem>) signature', () => {
            it(`should return a ${CLASS_NAME} instance`, () => {
                assert.instanceOf(
                    newParser(),
                    Parser,
                );
            });
        });
    });
    describe('getContentType method', () => {
        describe('() signature', () => {
            const test = { type: 'text/text' };
            before(() => {
                test.parser = newParser({ type: test.type });
            });
            it('should return the content type', () => {
                assert.equal(test.parser.getContentType(), test.type);
            });
        });
    });
    describe('getEncoding method', () => {
        describe('() signature', () => {
            const test = { encoding: 'utf16' };
            before(() => {
                test.parser = newParser({ encoding: test.encoding });
            });
            it('should return the configured encoding', () => {
                assert.equal(test.parser.getEncoding(), test.encoding);
            });
        });
    });
    describe('getAuto method', () => {
        describe('() signature', () => {
            it('should execute getJson() if JSON data is sent', () => {
                const parser = newParser({
                    body: { foo: { bar: 'hello world' } },
                    type: 'json',
                });
                assert.equal(
                    parser.getAuto().foo.bar,
                    parser.getJson().foo.bar,
                );
            });
            it('should execute getForm() if form data is sent', () => {
                const parser = newParser({
                    body: { foo: 'hello world' },
                    type: 'form',
                });
                assert.equal(
                    parser.getAuto().foo,
                    parser.getForm().foo,
                );
            });
            it('should execute getText() if text data is sent', () => {
                const parser = newParser({
                    body: 'hello world',
                    type: 'text',
                });
                assert.equal(parser.getAuto(), parser.getText());
            });
            it(
                'should execute getMultipart() if multipart data is sent',
                async () => {
                    const content = '(content of the uploaded file)';
                    const body = Buffer.from([
                        '-----------------------------974767299852498929531610',
                        'Content-Disposition: form-data; name="description"',
                        '',
                        'some text',
                        '-----------------------------974767299852498929531610',
                        // eslint-disable-next-line
                        'Content-Disposition: form-data; name="file"; filename="f.txt"',
                        'Content-Type: text/text',
                        '',
                        content,
                        // eslint-disable-next-line
                        '-----------------------------974767299852498929531610--',
                    ].join('\r\n'));
                    // eslint-disable-next-line
                    const type = 'Content-Type: multipart/form-data; boundary=---------------------------974767299852498929531610';
                    const parser = newParser({
                        body,
                        type,
                    });

                    const result = await parser.getAuto();

                    assert.equal(result.description, 'some text');
                    assert.isObject(result.file);
                    assert.equal(fs.readFileSync(result.file.path), content);
                }
            );
        });
    });
    describe('getJson method', () => {
        describe('() signature', () => {
            const test = {
                body: {
                    bar: 'BAR',
                    baz: 'BAZ',
                    foo: 'FOO',
                },
            };
            before(() => {
                test.parser = newParser({
                    body: test.body,
                    type: 'json',
                });
            });
            it('should return an Object', () => {
                assert.isObject(test.parser.getJson());
            });
            it('should contain the sent JSON data', () => {
                const json = test.parser.getJson();
                for (const [ key, value ] of Object.entries(test.body)) {
                    assert.equal(value, json[key]);
                }
            });
        });
    });
    describe('getForm method', () => {
        describe('() signature', () => {
            const test = {
                body: {
                    bar: 'world',
                    foo: 'hello',
                },
            };
            before(() => {
                test.parser = newParser({
                    body: test.body,
                    type: 'form',
                });
            });
            it('should return an Object', () => {
                assert.isObject(test.parser.getForm());
            });
            it('should contain the sent fields', () => {
                const form = test.parser.getForm();
                for (const [ key, value ] of Object.entries(test.body)) {
                    assert.equal(value, form[key]);
                }
            });
        });
    });
    describe('getText method', () => {
        describe('() signature', () => {
            const test = { body: 'hello, world' };
            before(() => {
                test.parser = newParser({ body: test.body });
            });
            it('should return a String', () => {
                assert.isString(test.parser.getText());
            });
            it('should contain the sent text', () => {
                assert.equal(test.parser.getText(), test.body);
            });
        });
    });
    describe('getMultipart method', () => {
        describe('() signature', () => {
            const content = '(content of the uploaded file)';
            const test = {
                body: Buffer.from([
                    '-----------------------------974767299852498929531610575',
                    'Content-Disposition: form-data; name="description"',
                    '',
                    'some text',
                    '-----------------------------974767299852498929531610575',
                    // eslint-disable-next-line
                    'Content-Disposition: form-data; name="file"; filename="f.txt"',
                    'Content-Type: text/text',
                    '',
                    content,
                    // eslint-disable-next-line
                    '-----------------------------974767299852498929531610575--',
                ].join('\r\n')),
                content,
                // eslint-disable-next-line
                type: 'Content-Type: multipart/form-data; boundary=---------------------------974767299852498929531610575'
            };
            before(() => {
                test.parser = newParser({
                    body: test.body,
                    type: test.type,
                });
                test.result = test.parser.getMultipart();
            });
            it('should return a Promise', () => {
                assert.isPromise(test.result);
            });
            it('should resolve to an Object', async () => {
                assert.isObject(await test.result);
            });
            it('should contain the form values', async () => {
                assert.equal((await test.result).description, 'some text');
            });
            it('should return an object for an attached file', async () => {
                const result = await test.result;
                assert.isObject(result.file);
            });
            it('return a path to the file', async () => {
                const result = await test.result;
                assert.equal(
                    fs.readFileSync(result.file.path),
                    content,
                );
            });
        });
    });
});
