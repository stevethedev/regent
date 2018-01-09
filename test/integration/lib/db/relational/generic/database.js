/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert         = require('regent/lib/util/assert');
const Collection     = require('regent/lib/support/collection');
const Database       = require('regent/lib/db/database');
const { $protected } = require('regent/lib/util/scope')();

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
} = require('regent/lib/event/event-list');

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
        await connection.send(`DROP TABLE ${TABLE}`);
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
            describe('(<query>) signature', () => {
                it('should return a Promise');
                it('should resolve to Boolean(true) if it succeeds');
                it('should resolve to Boolean(false) if it fails');
            });
            describe('(<query>, <bound>) signature', () => {
                it('should return a Promise');
                it('should resolve to Boolean(true) if it succeeds');
                it('should resolve to Boolean(false) if it fails');
            });
        });
        describe('update method', () => {
            describe('(<query>) signature', () => {
                it('should return a Promise');
                it('should resolve to an integer of the number of updates');
                it('should resolve to 0 if the query fails');
            });
            describe('(<query>, <bound>) signature', () => {
                it('should return a Promise');
                it('should resolve to an integer of the number of updates');
                it('should resolve to 0 if the query fails');
            });
        });
        describe('delete method', () => {
            describe('(<query>) signature', () => {
                it('should return a Promise');
                it('should resolve to an integer of the number of deletions');
                it('should resolve to 0 if the query fails');
            });
            describe('(<query>, <bound>) signature', () => {
                it('should return a Promise');
                it('should resolve to an integer of the number of deletions');
                it('should resolve to 0 if the query fails');
            });
        });
        describe('statement method', () => {
            describe('(<query>) signature', () => {
                it('should return a Promise');
                it('should resolve to the Database object');
            });
            describe('(<query>, <bound>) signature', () => {
                it('should return a Promise');
                it('should resolve to the Database object');
            });
        });
    });
};
