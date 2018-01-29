/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert     = require('regent-js/lib/util/assert');
const Connection = require('regent-js/lib/db/relational/connection');
const Record     = require('regent-js/lib/db/relational/record');

const connection = new Connection();

const CLASS_NAME = Record.name;

const OPTIONS = {
    connection,
    tableName: 'table',
};
const INDEX = {
    field: 'field',
    value: 'value',
};
const VALUES = {
    bar: 'bar',
    baz: 'baz',
    foo: 'foo',
};

const newConnection = () => Record.create(OPTIONS, INDEX, VALUES);

const runBefore = (callback) => {
    const test = {};
    before(() => {
        test.record = newConnection();
        return callback && callback();
    });
    return test;
};

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        describe('(<options>, <index>, <attributes>) signature', () => {
            const test = {};
            before(() => {
                test.record = new Record(OPTIONS, INDEX, VALUES);
            });
            it(`should return a ${CLASS_NAME} instance`, () => {
                assert.instanceOf(test.record, Record);
            });
            it('should seed the index field', () => {
                assert.equal(test.record.getIdField(), INDEX.field);
            });
            it('should seed the index value', () => {
                assert.equal(test.record.getId(), INDEX.value);
            });
            it('should seed the attributes', () => {
                for (const [ key, value ] of Object.entries(VALUES)) {
                    assert.equal(test.record.getAttribute(key), value);
                }
            });
        });
        describe('(<options>, <index>) signature', () => {
            const test = {};
            before(() => {
                test.record = new Record(OPTIONS, INDEX);
            });
            it(`should return a ${CLASS_NAME} instance`, () => {
                assert.instanceOf(test.record, Record);
            });
            it('should seed the index field', () => {
                assert.equal(test.record.getIdField(), INDEX.field);
            });
            it('should seed the index value', () => {
                assert.equal(test.record.getId(), INDEX.value);
            });
        });
        describe('(<options>) signature', () => {
            const test = {};
            before(() => {
                test.record = new Record(OPTIONS);
            });
            it(`should return a ${CLASS_NAME} instance`, () => {
                assert.instanceOf(test.record, Record);
            });
            it('should default index to { field: "id" }', () => {
                assert.equal(test.record.getIdField(), 'id');
            });
            it('should default the index value to <null>', () => {
                assert.isNull(test.record.getId());
            });
        });
    });
    describe('getAttribute method', () => {
        describe('(<attribute>, <default>) signature', () => {
            const test = runBefore();
            it('should return the value of <attribute>', () => {
                for (const [ key, value ] of Object.entries(VALUES)) {
                    assert.equal(test.record.getAttribute(key), value);
                }
            });
            it('should fail to <default>', () => {
                assert.equal(
                    test.record.getAttribute('helloworld', 'bonanza'),
                    'bonanza'
                );
            });
        });
        describe('(<attribute>) signature', () => {
            const test = runBefore();
            it('should return the value of <attribute>', () => {
                for (const [ key, value ] of Object.entries(VALUES)) {
                    assert.equal(test.record.getAttribute(key), value);
                }
            });
            it('should fail to <null>', () => {
                assert.isNull(test.record.getAttribute('helloworld'));
            });
        });
    });
    describe('setAttribute method', () => {
        describe('(<attribute>, <value>) signature', () => {
            const test = runBefore();
            it('should queue setting <attribute> to equal <value>', () => {
                test.record.setAttribute('foo', 'bar');
                assert.equal(test.record.getAttribute('foo'), 'bar');
            });
            it(`should return the ${CLASS_NAME}`, () => {
                assert.equal(test.record.setAttribute('a', 'b'), test.record);
            });
        });
    });
    describe('getIdField method', () => {
        describe('() signature', () => {
            const test = runBefore();
            it('should return the index field name', () => {
                assert.equal(test.record.getIdField(), INDEX.field);
            });
        });
    });
    describe('getId method', () => {
        describe('() signature', () => {
            const test = runBefore();
            it('should return the index value', () => {
                assert.equal(test.record.getId(), INDEX.value);
            });
        });
    });
});
