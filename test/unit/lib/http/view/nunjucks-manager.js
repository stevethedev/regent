/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert     = require('regent-js/lib/util/assert');
const path       = require('path');
const dir        = path.join(__dirname, 'templates');
const fs         = require('fs');
const NjkManager = require('regent-js/lib/http/view/nunjucks-manager');
const options    = { Directories: { view: dir } };
const regent     = global.newRegent(options);
const file       = 'test.njk';
const template   = fs.readFileSync(path.join(dir, file), { encoding: 'utf8' });

const newNjkMgr  = (opt) => new NjkManager(regent, opt);

const CLASS_NAME = NjkManager.name;

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        describe('(<regent>, <options>) signature', () => {
            const opt = {
                tags: {
                    block   : [ '[%', '%]' ],
                    comment : [ '[#', '#]' ],
                    variable: [ '[$', '$]' ],
                },
            };
            const test = {};
            before(async () => {
                test.manager = newNjkMgr(opt);
                test.result = await test.manager.render(file, {});
            });
            it(`should return a ${CLASS_NAME} object`, () => {
                assert.instanceOf(test.manager, NjkManager);
            });
            it('should use <options.tags> to override data', () => {
                assert.equal(test.result, template);
            });
        });
        describe('(<regent>) signature', () => {
            it(`should return a ${CLASS_NAME} object`, () => {
                assert.instanceOf(newNjkMgr(), NjkManager);
            });
        });
    });
    describe('render method', () => {
        describe('(<viewName>, <context>) signature', () => {
            const context = {
                condition: true,
                value    : 'success',
            };
            const test = {};
            before(async () => {
                test.manager = newNjkMgr();
                test.result = await test.manager.render(file, context);
            });
            it('should return a String', () => {
                assert.isString(test.result);
            });
            it(
                'should use <context> to fill in values in template <viewName>',
                () => assert.equal(test.result, context.value),
            );
            it('should throw if <viewName> is unavailable', () => {
                assert.rejects(() => test.manager.render(`-${file}`, context));
            });
        });
        describe('(<viewName>) signature', () => {
            const test = {};
            before(async () => {
                test.manager = newNjkMgr();
                test.result = await test.manager.render(file);
            });
            it('should return a String', () => {
                assert.isString(test.result);
            });
            it('should read the view at <viewName>', () => {
                assert.equal(test.result, '');
            });
            it('should throw if <viewName> is unavailable', () => {
                assert.rejects(() => test.manager.render(`-${file}`));
            });
        });
    });
});
