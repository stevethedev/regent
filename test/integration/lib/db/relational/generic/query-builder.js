/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = requireLib('util/assert');
const Collection   = requireLib('support/collection');
const QueryBuilder = requireLib('db/relational/query-builder');
const Record       = requireLib('db/relational/record');

const TABLE_NAME   = 'query_builder';
const CLASS_NAME   = QueryBuilder.name;
const COL_NAME     = 'test_col';
const COL_ID       = 'id';
const TABLE_VALUES = [
    'foo',
    'bar',
    'baz',
];

module.exports = function(testGroup, Connection, config) {
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

        describe('chunk method', () => {
            describe('(<chunk-size>) signature', () => {
                it('should return a generator-iterator', () => {
                    const query = connection.table(TABLE_NAME);
                    return assert.isGenerator(query.orderBy(COL_ID).chunk(1));
                });
                it('should iterate into a Promise', () => {
                    const query   = connection.table(TABLE_NAME);
                    const iter    = query.orderBy(COL_ID).chunk(1);
                    const promise = iter.next().value;
                    assert.isPromise(promise);
                    return promise.then(() => iter.done());
                });
                it('should resolve into a Collection', () => {
                    const query = connection.table(TABLE_NAME);
                    const iter  = query.orderBy(COL_ID).chunk(1);
                    return iter.next().value
                        .then((result) => assert.instanceOf(
                            result,
                            Collection
                        ))
                        .then(() => iter.done());
                });
                it('should iterate through the entire result set', () => {
                    let promise = Promise.resolve();
                    const query = connection.table(TABLE_NAME);
                    const iter  = query.orderBy(COL_ID).chunk(1);
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
                it(
                    'should return an empty array in the last result set',
                    () => {
                        const query = connection.table(TABLE_NAME);
                        const iter = query.orderBy(COL_ID).chunk(1);
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
                    }
                );
                it('should be iterable with for ... of', (done) => {
                    (async () => {
                        const query = connection.table(TABLE_NAME);
                        let i = 0;
                        for (const chunk of query.orderBy(COL_ID).chunk(1)) {
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
                it('should return a Promise', () => {
                    const query = connection.table(TABLE_NAME);
                    const promise = query.orderBy(COL_ID).first();
                    assert.isPromise(promise);
                    return promise;
                });
                it('should resolve to a Record', () => {
                    const query = connection.table(TABLE_NAME);
                    const promise = query.orderBy(COL_ID).first();
                    return Promise.resolve(promise)
                        .then((record) => assert.instanceOf(record, Record));
                });
                it('should resolve to the first Record', () => {
                    const query   = connection.table(TABLE_NAME);
                    const promise = query.orderBy(COL_ID).first();
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
                it('should return a Promise', () => {
                    const query = connection.table(TABLE_NAME);
                    const promise = query.orderBy(COL_ID).get();
                    assert.isPromise(promise);
                    return promise;
                });
                it('should resolve to a Collection', () => {
                    const query = connection.table(TABLE_NAME);
                    const promise = query.orderBy(COL_ID).get();
                    return promise.then((collection) => assert.instanceOf(
                        collection,
                        Collection,
                    ));
                });
            });
        });
        describe('iterator method', () => {
            describe('() signature', () => {
                it('should return a generator-iterator', () => {
                    const query = connection.table(TABLE_NAME);
                    const iter  = query.orderBy(COL_ID).iterator();
                    assert.isGenerator(iter);
                    iter.done();
                });
                it('should iterate into Promises', () => {
                    const query = connection.table(TABLE_NAME);
                    const iter  = query.orderBy(COL_ID).iterator();
                    const promise = iter.next().value;
                    assert.isPromise(promise);
                    return Promise.resolve(promise)
                        .then(() => iter.done());
                });
                it('should resolve into Records', () => {
                    const query = connection.table(TABLE_NAME);
                    const iter  = query.orderBy(COL_ID).iterator();
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
                it('should return a Promise', () => {
                    const query = connection.table(TABLE_NAME);
                    const promise = query.orderBy(COL_ID).last();
                    assert.isPromise(promise);
                    return promise;
                });
                it('should resolve to a Record', () => {
                    const query = connection.table(TABLE_NAME);
                    const promise = query.orderBy(COL_ID).last();
                    return Promise.resolve(promise)
                        .then((record) => assert.instanceOf(record, Record));
                });
                it('should resolve to the last Record', () => {
                    const query = connection.table(TABLE_NAME);
                    const promise = query.orderBy(COL_ID).last();
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
                it('should return a Promise', () => {
                    const query = connection.table(TABLE_NAME);
                    const promise = query.orderBy(COL_ID).pluck(COL_NAME);
                    assert.isPromise(promise);
                    return promise;
                });
                it('should resolve to a Collection', () => {
                    const query = connection.table(TABLE_NAME);
                    const promise = query.orderBy(COL_ID).pluck(COL_NAME);
                    return Promise.resolve(promise)
                        .then((collection) => assert.instanceOf(
                            collection,
                            Collection
                        ));
                });
                it(
                    'should only include the <field> key in the Collection',
                    () => {
                        const query = connection.table(TABLE_NAME);
                        const promise = query.orderBy(COL_ID).pluck(COL_NAME);
                        return Promise.resolve(promise)
                            .then((collection) => collection.forEach(
                                (value, index) => {
                                    assert.equal(value, TABLE_VALUES[index]);
                                })
                            );
                    }
                );
            });
        });
        describe('value method', () => {
            describe('(<field>) signature', () => {
                it('should return a Promise', () => {
                    const query = connection.table(TABLE_NAME);
                    const promise = query.orderBy(COL_ID).value(COL_NAME);
                    assert.isPromise(promise);
                    return promise;
                });
                it('should resolve to the value in the first record', () => {
                    const query = connection.table(TABLE_NAME);
                    const promise = query.orderBy(COL_ID).value(COL_NAME);
                    return Promise.resolve(promise)
                        .then((value) => assert.equal(value, TABLE_VALUES[0]));
                });
            });
        });
    });
};
