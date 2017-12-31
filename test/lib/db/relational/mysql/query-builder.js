/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = requireLib('util/assert');
const Collection   = requireLib('support/collection');
const MysqlDb      = requireLib('db/relational/mysql/connection');
const QueryBuilder = requireLib('db/relational/query-builder');
const Record       = requireLib('db/relational/record');

const config       = require('./config');

const CLASS_NAME   = QueryBuilder.name;
const TABLE_NAME   = 'mysql_execution';
const COL_NAME     = 'test_col';
const TABLE_VALUES = [
    'foo',
    'bar',
    'baz',
];

describe(`MySQL ${CLASS_NAME} execution methods`, () => {
    let mysql = null;

    before(() => {
        // mysql = MysqlDb.create(config);
        // return mysql.connect()
        //     .then(() => mysql.send(`DROP TABLE IF EXISTS ${TABLE_NAME}`))
        //     .then(() => mysql.send(
        //         `CREATE TABLE ${TABLE_NAME} (${COL_NAME} TEXT)`
        //     ))
        //     .then(() => mysql.send(
        //         `INSERT INTO ${
        //             TABLE_NAME
        //         } (${
        //             COL_NAME
        //         }) VALUES (${
        //             TABLE_VALUES.map(() => '?').join('), (')
        //         })`,
        //         TABLE_VALUES
        //     ));
    });

    after(() => {
        // return Promise.resolve()
        //     .then(() => mysql.send(`DROP TABLE ${TABLE_NAME}`, []))
        //     .then(() => mysql.disconnect());
    });

    describe('chunk method', () => {
        describe('(<chunk-size>) signature', () => {
            xit('should return a generator-iterator', () => {
                const query = mysql.table(TABLE_NAME);
                return assert.isGenerator(query.chunk(1));
            });
            xit('should iterate into a Promise', () => {
                const query   = mysql.table(TABLE_NAME);
                const iter    = query.chunk(1);
                const promise = iter.next().value;
                assert.isPromise(promise);
                return promise.then(() => iter.done());
            });
            xit('should resolve into a Collection', () => {
                const query = mysql.table(TABLE_NAME);
                const iter  = query.chunk(1);
                return iter.next().value
                    .then((result) => assert.instanceOf(
                        result,
                        Collection
                    ))
                    .then(() => iter.done());
            });
            xit('should iterate through the entire result set', () => {
                let promise = Promise.resolve();
                const query = mysql.table(TABLE_NAME);
                const iter  = query.chunk(1);
                for (let i = 0; i < TABLE_VALUES.length; ++i) {
                    promise = promise.then(() => iter.next().value)
                        .then((rows) => {
                            assert.equal(rows.size(), 1);
                            assert.equal(
                                rows.get(0).getAttribute(COL_NAME),
                                TABLE_VALUES[i]
                            );
                        });
                }
                return promise.then(() => iter.done());
            });
            xit('should return an empty array in the last result set', () => {
                const query = mysql.table(TABLE_NAME);
                const iter = query.chunk(1);
                let promise = Promise.resolve();
                for (let i = 0; i < TABLE_VALUES.length; ++i) {
                    promise = promise.then(() => iter.next().value);
                }
                return promise.then(() => iter.next().value)
                    .then((rows) => assert.instanceOf(
                        rows,
                        Collection,
                    ))
                    .then(() => {
                        const node = iter.next();
                        assert.isTrue(node.done);
                    })
                    .then(() => iter.done());
            });
            xit('should be iterable with for ... of', (done) => {
                (async () => {
                    const query = mysql.table(TABLE_NAME);
                    let i = 0;
                    for (const chunk of query.chunk(1)) {
                        assert.instanceOf(
                            await chunk,
                            Collection,
                        );
                        i++;
                    }
                    // Last set is empty
                    assert.equal(i, 1 + TABLE_VALUES.length);
                    done();
                })();
            });
        });
    });
    describe('first method', () => {
        describe('() signature', () => {
            xit('should return a Promise', () => {
                const query = mysql.table(TABLE_NAME);
                const promise = query.first();
                assert.isPromise(promise);
                return promise;
            });
            xit('should resolve to a Record', () => {
                const query = mysql.table(TABLE_NAME);
                const promise = query.first();
                return Promise.resolve(promise)
                    .then((record) => assert.instanceOf(record, Record));
            });
            xit('should resolve to the first Record', () => {
                const query   = mysql.table(TABLE_NAME);
                const promise = query.first();
                return Promise.resolve(promise)
                    .then((record) => assert.equal(
                        record.getAttribute(COL_NAME),
                        TABLE_VALUES[0],
                    ));
            });
        });
    });
    describe('get method', () => {
        describe('() signature', () => {
            xit('should return a Promise', () => {
                const query = mysql.table(TABLE_NAME);
                const promise = query.get();
                assert.isPromise(promise);
                return promise;
            });
            xit('should resolve to a Collection', () => {
                const query = mysql.table(TABLE_NAME);
                const promise = query.get();
                return promise.then((collection) => assert.instanceOf(
                    collection,
                    Collection,
                ));
            });
        });
    });
    describe('iterator method', () => {
        describe('() signature', () => {
            xit('should return a generator-iterator', () => {
                const query = mysql.table(TABLE_NAME);
                const iter  = query.iterator();
                assert.isGenerator(iter);
                iter.done();
            });
            xit('should iterate into Promises', () => {
                const query = mysql.table(TABLE_NAME);
                const iter  = query.iterator();
                const promise = iter.next().value;
                assert.isPromise(promise);
                return Promise.resolve(promise)
                    .then(() => iter.done());
            });
            xit('should resolve into Records', () => {
                const query = mysql.table(TABLE_NAME);
                const iter  = query.iterator();
                const promise = iter.next().value;
                return Promise.resolve(promise)
                    .then((record) => {
                        iter.done();
                        return record;
                    })
                    .then((record) => assert.instanceOf(record, Record));
            });
        });
    });
    describe('last method', () => {
        describe('(<field>) signature', () => {
            xit('should return a Promise', () => {
                const query = mysql.table(TABLE_NAME);
                const promise = query.last();
                assert.isPromise(promise);
                return promise;
            });
            xit('should resolve to a Record', () => {
                const query = mysql.table(TABLE_NAME);
                const promise = query.last();
                return Promise.resolve(promise)
                    .then((record) => assert.instanceOf(record, Record));
            });
            xit('should resolve to the last Record', () => {
                const query = mysql.table(TABLE_NAME);
                const promise = query.last();
                return Promise.resolve(promise)
                    .then((record) => assert.equal(
                        record.getAttribute(COL_NAME),
                        TABLE_VALUES[TABLE_VALUES.length - 1],
                    ));
            });
        });
    });
    describe('pluck method', () => {
        describe('(<field>) signature', () => {
            xit('should return a Promise', () => {
                const query = mysql.table(TABLE_NAME);
                const promise = query.pluck(COL_NAME);
                assert.isPromise(promise);
                return promise;
            });
            xit('should resolve to a Collection', () => {
                const query = mysql.table(TABLE_NAME);
                const promise = query.pluck(COL_NAME);
                return Promise.resolve(promise)
                    .then((collection) => assert.instanceOf(
                        collection,
                        Collection
                    ));
            });
            xit('should only include the <field> key in the Collection', () => {
                const query = mysql.table(TABLE_NAME);
                const promise = query.pluck(COL_NAME);
                return Promise.resolve(promise)
                    .then((collection) => collection.forEach((value, index) => {
                        assert.equal(value, TABLE_VALUES[index]);
                    }));
            });
        });
    });
    describe('value method', () => {
        describe('(<field>) signature', () => {
            xit('should return a Promise', () => {
                const query = mysql.table(TABLE_NAME);
                const promise = query.value(COL_NAME);
                assert.isPromise(promise);
                return promise;
            });
            xit('should resolve to the value in the first record', () => {
                const query = mysql.table(TABLE_NAME);
                const promise = query.value(COL_NAME);
                return Promise.resolve(promise)
                    .then((value) => assert.equal(value, TABLE_VALUES[0]));
            });
        });
    });
});
