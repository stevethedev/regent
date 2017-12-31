/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = requireLib('util/assert');
const Collection   = requireLib('support/collection');
const QueryBuilder = requireLib('db/relational/query-builder');
const PostgresDb   = requireLib('db/relational/postgresql/connection');
const config       = require('./config');

const CLASS_NAME   = QueryBuilder.name;
const TABLE_NAME   = 'psql_execution';
const COL_NAME     = 'test_col';
const TABLE_VALUES = [
    'foo',
    'bar',
    'baz',
];
const GeneratorFunction = Object.getPrototypeOf((function* () {
    // Empty function
})()).constructor;

describe(`PostgreSQL ${CLASS_NAME} execution methods`, () => {
    let psql = null;

    before(() => {
        psql = PostgresDb.create(config);
        return psql.connect()
            .then(() => psql.send(`DROP TABLE IF EXISTS ${TABLE_NAME}`))
            .then(() => psql.send(
                `CREATE TABLE ${TABLE_NAME} (${COL_NAME} TEXT)`
            ))
            .then(() => psql.send(
                `INSERT INTO ${
                    TABLE_NAME
                } (${
                    COL_NAME
                }) VALUES (${
                    TABLE_VALUES.map((...[ , i ]) => `$${++i}`).join('), (')
                })`,
                TABLE_VALUES
            ));
    });

    after(() => {
        return Promise.resolve()
            .then(() => psql.send(`DROP TABLE ${TABLE_NAME}`, []))
            .then(() => psql.disconnect());
    });

    describe('chunk method', () => {
        describe('(<chunk-size>) signature', () => {
            it('should return a generator-iterator', () => {
                const query = psql.table(TABLE_NAME);
                return assert.equal(
                    query.chunk(1).constructor,
                    GeneratorFunction
                );
            });
            it('should iterate into a Promise', () => {
                const query   = psql.table(TABLE_NAME);
                const iter    = query.chunk(1);
                const promise = iter.next().value;
                assert.instanceOf(promise, Promise);
                return promise.then(() => iter.done());
            });
            it('should resolve into a Collection', () => {
                const query = psql.table(TABLE_NAME);
                const iter  = query.chunk(1);
                return iter.next().value
                    .then((result) => assert.instanceOf(
                        result,
                        Collection
                    ))
                    .then(() => iter.done());
            });
            it('should iterate through the entire result set', () => {
                let promise = Promise.resolve();
                const query = psql.table(TABLE_NAME);
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
            it('should return an empty array in the last result set', () => {
                const query = psql.table(TABLE_NAME);
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
            it('should be iterable with for ... of', (done) => {
                (async () => {
                    const query = psql.table(TABLE_NAME);
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
            it('should return a Promise');
            it('should resolve to a Record');
        });
    });
    describe('get method', () => {
        describe('() signature', () => {
            it('should return a Promise', () => {
                const query = psql.table(TABLE_NAME);
                const promise = query.get();
                assert.instanceOf(promise, Promise);
                return promise;
            });
            it('should resolve to a Collection', () => {
                const query = psql.table(TABLE_NAME);
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
            it('should return a generator-iterator');
            it('should iterate into Promises');
            it('should send a request to the database on each iteration');
            it('should resolve into Records');
        });
    });
    describe('last method', () => {
        describe('(<field>) signature', () => {
            it('should send a request to the database');
            it('should add "ORDER BY <DESC>" to the query');
            it('should add "LIMIT 1" to the query');
            it('should return a Promise');
            it('should resolve to a value');
        });
    });
    describe('pluck method', () => {
        describe('(<field>) signature', () => {
            it('should return a Promise');
            it('should resolve to a Collection');
            it('should only include the <field> key in the Collection');
        });
        describe('(<field>, <alias>) signature', () => {
            it('should return a Promise');
            it('should resolve to a Collection');
            it('should only include the <alias> key in the Collection');
        });
    });
    describe('value method', () => {
        describe('(<field>) signature', () => {
            it('should return a Promise');
            it('should resolve to a value');
        });
    });
});
