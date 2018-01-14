/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert         = require('regent-js/lib/util/assert');
const Collection     = require('regent-js/lib/support/collection');
const Database       = require('regent-js/lib/db/database');
const { $protected } = require('regent-js/lib/util/scope')();

const CLASS_NAME     = Database.name;

const {
    DB_ACQUIRE,
    DB_CONNECT,
    DB_CONNECT_NO,
    DB_CONNECT_TRY,
    DB_DISCONNECT,
    DB_DISCONN_NO,
    DB_DISCONN_TRY,
    DB_ERROR,
    DB_QUERY_AFTER,
    DB_QUERY_BEFORE,
    DB_REMOVE,
} = require('regent-js/lib/event/event-list');

const EVENT_ENUM = [
    DB_ACQUIRE,
    DB_CONNECT,
    DB_CONNECT_NO,
    DB_CONNECT_TRY,
    DB_DISCONNECT,
    DB_DISCONN_NO,
    DB_DISCONN_TRY,
    DB_ERROR,
    DB_QUERY_AFTER,
    DB_QUERY_BEFORE,
    DB_REMOVE,
];

const TABLE  = 'database_table';
const COLUMN = 'database_column';
const VALUES = [ 'foo', 'bar' ];

module.exports = function(testGroup, options, bindVariable) {
    const localRegent = global.newRegent();
    const database    = new Database(localRegent, options);

    const setupTable = async () => {
        const connection = database.write();
        await connection.connect();
        const bound = [];
        await connection.send(
            `CREATE TABLE IF NOT EXISTS ${TABLE} (${COLUMN} TEXT)`
        );
        await connection.send(
            `INSERT INTO ${TABLE} (${COLUMN}) VALUES (${
                VALUES.map((value) => bindVariable(value, bound)).join('),(')
            })`,
            bound,
        );
    };

    const teardownTable = async () => {
        const connection = database.write();
        await connection.send(`DROP TABLE IF EXISTS ${TABLE}`);
        await connection.disconnect();
    };

    describe(`${testGroup} ${CLASS_NAME} execution methods`, () => {
        describe('constructor', () => {
            describe('any signature', () => {
                EVENT_ENUM.forEach((eventName) => it(
                    `should register the ${eventName} event on Regent`,
                    () => {
                        const { emitter } = $protected(database.read());
                        let executed = false;
                        localRegent.getEmitter().on(eventName, () => {
                            executed = true;
                        });
                        emitter.emit(eventName);
                        assert.isTrue(executed);
                    }
                ));
            });
        });
        describe('select method', () => {
            before(setupTable);
            after(teardownTable);
            describe('(<query>) signature', () => {
                const QUERY = `SELECT * FROM ${TABLE}`;
                it('should return a Promise', () => {
                    const promise = database.select(QUERY);
                    assert.isPromise(promise);
                    return promise;
                });
                it('should resolve to a Collection of Objects', () => {
                    const promise = database.select(QUERY);
                    return Promise.resolve(promise)
                        .then((collection) => {
                            assert.instanceOf(collection, Collection);
                            collection.forEach((record, i) => {
                                assert.isObject(record);
                                assert.equal(record[COLUMN], VALUES[i]);
                            });
                        });
                });
            });
            describe('(<query>, <bound>) signature', () => {
                const VALUE = [];
                const QUERY = `SELECT * FROM ${TABLE} WHERE ${COLUMN} = ${
                    bindVariable(VALUES[0], VALUE)
                }`;
                it('should return a Promise', () => {
                    const promise = database.select(QUERY, VALUE);
                    assert.isPromise(promise);
                    return promise;
                });
                it('should resolve to a Collection of Objects', () => {
                    const promise = database.select(QUERY, VALUE);
                    return Promise.resolve(promise)
                        .then((collection) => {
                            assert.instanceOf(collection, Collection);
                            collection.forEach((record, i) => {
                                assert.isObject(record);
                                assert.equal(record[COLUMN], VALUE[i]);
                            });
                        });
                });
            });
        });
        describe('insert method', () => {
            before(setupTable);
            after(teardownTable);
            describe('(<query>) signature', () => {
                const QUERY = `INSERT INTO ${TABLE} (${COLUMN}) VALUES ('BAZ')`;
                it('should return a Promise', () => {
                    const promise = database.insert(QUERY);
                    assert.isPromise(promise);
                    return promise;
                });
                it('should resolve to the number of inserts', () => {
                    const promise = database.insert(QUERY);
                    return Promise.resolve(promise)
                        .then((success) => assert.equal(success, 1));
                });
            });
            describe('(<query>, <bound>) signature', () => {
                const VALUE = [];
                const QUERY = `INSERT INTO ${TABLE} (${COLUMN}) VALUES (${
                    bindVariable('BAZ', VALUE)
                })`;
                it('should return a Promise', () => {
                    const promise = database.insert(QUERY, VALUE);
                    assert.isPromise(promise);
                    return promise;
                });
                it('should resolve to the number of inserts', () => {
                    const promise = database.insert(QUERY, VALUE);
                    return Promise.resolve(promise)
                        .then((success) => assert.equal(success, 1));
                });
            });
        });
        describe('update method', () => {
            beforeEach(() => {
                return Promise.resolve()
                    .then(teardownTable)
                    .then(setupTable);
            });
            after(teardownTable);
            describe('(<query>) signature', () => {
                const VALUE = `${Math.random()}`;
                const QUERY = `UPDATE ${TABLE} SET ${COLUMN} = '${VALUE}'`;
                it('should return a Promise', () => {
                    const promise = database.update(QUERY);
                    assert.isPromise(promise);
                    return promise;
                });
                it(
                    'should resolve to an integer of the number of updates',
                    () => {
                        const promise = database.update(QUERY);
                        return Promise.resolve(promise)
                            .then((success) => assert.equal(
                                success,
                                VALUES.length,
                            ));
                    }
                );
                it('should resolve to 0 if the query fails', () => {
                    const promise = database.update(
                        `UPDATE ${TABLE} SET ${COLUMN} = 'foo' WHERE false`
                    );
                    return Promise.resolve(promise)
                        .then((success) => assert.equal(success, 0));
                });
            });
            describe('(<query>, <bound>) signature', () => {
                const VALUE = [];
                const QUERY = `UPDATE ${TABLE} SET ${COLUMN} = ${
                    bindVariable(Math.random(), VALUE)
                }`;
                it('should return a Promise', () => {
                    const promise = database.update(QUERY, VALUE);
                    assert.isPromise(promise);
                    return promise;
                });
                it(
                    'should resolve to an integer of the number of updates',
                    () => {
                        const promise = database.update(QUERY, VALUE);
                        return Promise.resolve(promise)
                            .then((success) => assert.equal(
                                success,
                                VALUES.length,
                            ));
                    }
                );
                it('should resolve to 0 if the query fails', () => {
                    const promise = database.update(
                        `UPDATE ${TABLE} SET ${COLUMN} = ${
                            bindVariable('foo', [])
                        } WHERE false`,
                        ['foo'],
                    );
                    return Promise.resolve(promise)
                        .then((success) => assert.equal(success, 0));
                });
            });
        });
        describe('delete method', () => {
            beforeEach(() => {
                return Promise.resolve()
                    .then(teardownTable)
                    .then(setupTable);
            });
            after(teardownTable);
            describe('(<query>) signature', () => {
                const QUERY = `DELETE FROM ${TABLE}`;
                it('should return a Promise', () => {
                    const promise = database.delete(QUERY);
                    assert.isPromise(promise);
                    return promise;
                });
                it(
                    'should resolve to an integer of the number of deletions',
                    () => {
                        const promise = database.delete(QUERY);
                        return Promise.resolve(promise)
                            .then((result) => assert.equal(
                                result,
                                VALUES.length
                            ));
                    }
                );
            });
            describe('(<query>, <bound>) signature', () => {
                const DELETE_VALUES = [];
                const QUERY = `DELETE FROM ${TABLE} WHERE ${COLUMN} = ${
                    bindVariable(VALUES[0], DELETE_VALUES)
                }`;
                it('should return a Promise', () => {
                    const promise = database.delete(QUERY, DELETE_VALUES);
                    assert.isPromise(promise);
                    return promise;
                });
                it(
                    'should resolve to an integer of the number of deletions',
                    () => {
                        const promise = database.delete(QUERY, DELETE_VALUES);
                        return Promise.resolve(promise)
                            .then((result) => assert.equal(result, 1));
                    }
                );
            });
        });
        describe('statement method', () => {
            describe('(<query>) signature', () => {
                const VALUE = 'foobar';
                const QUERY = `CREATE TABLE ${TABLE} (
                    ${COLUMN} VARCHAR(6) DEFAULT '${VALUE}'
                )`;
                beforeEach(teardownTable);
                after(teardownTable);
                it('should return a Promise', () => {
                    const promise = database.statement(QUERY);
                    assert.isPromise(promise);
                    return promise;
                });
                it('should resolve to the Database object', () => {
                    const promise = database.statement(QUERY);
                    return Promise.resolve(promise)
                        .then((result) => assert.equal(result, database));
                });
            });
            // NOTE: PostgreSQL does not support this syntax
            if ('MySQL' === testGroup) {
                describe('(<query>, <bound>) signature', () => {
                    const VALUE = 'foobar';
                    const QUERY = `CREATE TABLE ${TABLE} (
                        ${COLUMN} VARCHAR(6) DEFAULT ${bindVariable(VALUE, [])}
                    )`;
                    beforeEach(teardownTable);
                    after(teardownTable);
                    it('should return a Promise', () => {
                        const promise = database.statement(QUERY, [VALUE]);
                        assert.isPromise(promise);
                        return promise;
                    });
                    it('should resolve to the Database object', () => {
                        const promise = database.statement(QUERY, [VALUE]);
                        return Promise.resolve(promise)
                            .then((result) => assert.equal(result, database));
                    });
                });
            }
        });
    });
};
