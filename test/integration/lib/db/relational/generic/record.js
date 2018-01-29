/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = require('regent-js/lib/util/assert');
const Record       = require('regent-js/lib/db/relational/record');

const TABLE_NAME   = 'record';
const COL_NAME     = 'test_col';
const COL_ID       = 'id';

const CLASS_NAME = Record.name;

module.exports = function(testGroup, Connection, config) {
    const TABLE_VALUES = [
        'foo',
        'bar',
        'baz',
    ];
    describe(`${testGroup} ${CLASS_NAME} execution methods`, () => {
        let connection = null;

        before(() => {
            connection = new Connection(config);
            return connection.connect()
                .then(() => connection.send(
                    `DROP TABLE IF EXISTS ${TABLE_NAME}`
                ))
                .then(() => connection.send(
                    `CREATE TABLE ${TABLE_NAME} (
                        ${COL_ID} INTEGER PRIMARY KEY,
                        ${COL_NAME} TEXT
                    )`
                ))
                .then(() => {
                    const query = connection.table(TABLE_NAME);
                    return Promise.all(TABLE_VALUES.map((value, i) => {
                        return query.insert({
                            [COL_ID]  : i + 1,
                            [COL_NAME]: value,
                        });
                    }));
                });
        });

        after(() => {
            return Promise.resolve()
                .then(() => connection.send(`DROP TABLE ${TABLE_NAME}`, []))
                .then(() => connection.disconnect());
        });

        describe('save method', () => {
            describe('() signature', () => {
                const test = {};
                before(async () => {
                    test.value = 'hello world';
                    test.record = await connection.table(TABLE_NAME).first();
                    test.record.setAttribute(COL_NAME, test.value);
                    TABLE_VALUES[0] = test.value;
                    test.promise = test.record.save();
                    test.result = await test.promise;
                });
                it('should return a Promise', () => {
                    assert.isPromise(test.promise);
                });
                it(`should resolve to the ${CLASS_NAME}`, () => {
                    assert.equal(test.result, test.record);
                });
                it('should save the record values', async () => {
                    await test.record.load();
                    assert.equal(
                        test.record.getAttribute(COL_NAME),
                        test.value
                    );
                });
                it(
                    'should create a new record if it doesn\'t have an id',
                    async () => {
                        const record = connection.table(TABLE_NAME).record();
                        await record.load();
                        record.setAttribute(COL_NAME, 'value');
                        record.setAttribute(COL_ID, TABLE_VALUES.length + 1);
                        await record.save();
                        const record2 = await connection.table(TABLE_NAME)
                            .where(COL_ID, TABLE_VALUES.length + 1)
                            .first();
                        assert.equal(record2.getAttribute(COL_NAME), 'value');
                    }
                );
            });
        });
        describe('load method', () => {
            describe('(<idValue>) signature', () => {
                const test = {};
                before(async () => {
                    test.record = await connection.table(TABLE_NAME)
                        .orderBy(COL_ID)
                        .first();
                    test.promise = test.record.load(TABLE_VALUES.length);
                    test.result = await test.promise;
                });
                it('should return a Promise', () => {
                    assert.isPromise(test.promise);
                });
                it(`shoudl resolve to the ${CLASS_NAME}`, () => {
                    assert.equal(test.result, test.record);
                });
                it(
                    'should load the corresponding record from the database',
                    () => {
                        assert.equal(
                            test.result.getAttribute(COL_NAME),
                            TABLE_VALUES[TABLE_VALUES.length - 1]
                        );
                    }
                );
            });
            describe('() signature', () => {
                const test = {};
                before(async () => {
                    test.record = await connection.table(TABLE_NAME)
                        .orderBy(COL_ID)
                        .first();
                    test.promise = test.record.load();
                    test.result = await test.promise;
                });
                it('should return a Promise', () => {
                    assert.isPromise(test.promise);
                });
                it(`shoudl resolve to the ${CLASS_NAME}`, () => {
                    assert.equal(test.result, test.record);
                });
                it(
                    'should load the current record from the database',
                    () => {
                        assert.equal(
                            test.result.getAttribute(COL_NAME),
                            TABLE_VALUES[0]
                        );
                    }
                );
            });
        });
    });
};
