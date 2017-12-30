/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert     = requireLib('util/assert');
const PostgresDb = requireLib('db/relational/postgresql/connection');
const config     = require('./config');

const CLASS_NAME = PostgresDb.name;

const connections = [];
const getConnection = (options = config) => {
    const connection = PostgresDb.create(options);
    connections.push(connection);
    return connection;
};

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        describe('(options) signature', () => {
            it('should add a table prefix if options.prefix is set', () => {
                const prefix = 'my-prefix';
                const psql = getConnection({ prefix });
                assert.equal(psql.getPrefix(), prefix);
            });
        });
    });
    describe('connect', () => {
        describe('() signature', () => {
            it('should return a Promise', () => {
                const result = getConnection().connect();
                assert.instanceOf(result, Promise);
                return result;
            });
            it('should resolve to false if connection fails', () => {
                const psql = getConnection({});
                return psql.connect().then((result) => {
                    psql.disconnect();
                    assert.isFalse(result);
                });
            });
            it('should resolve to true if connection succeeds', () => {
                const psql = getConnection();
                return psql.connect().then((result) => {
                    psql.disconnect();
                    assert.isTrue(result);
                });
            });
            it('should emit a "db-connect" event on success', () => {
                const psql = getConnection();
                let eventCount = 0;
                psql.on('db-connect', () => ++eventCount);
                return psql.connect().then(() => {
                    psql.disconnect();
                    assert.equal(eventCount, 1);
                });
            });
            it(
                'should not emit a "db-connect" event on failure',
                () => {
                    const psql = getConnection();
                    let eventCount = 0;
                    psql.on('db-connect', () => ++eventCount);

                    return Promise.resolve()
                        .then(() => psql.connect())
                        .then(() => psql.connect())
                        .then(() => {
                            psql.disconnect();
                            assert.equal(eventCount, 1);
                        });
                }
            );
        });
    });
    describe('disconnect', () => {
        describe('() signature', () => {
            it('should return a Promise', () => {
                const result = getConnection().connect();
                assert.instanceOf(result, Promise);
            });
            it('should resolve to true if disconnect succeeds', () => {
                const psql = getConnection();
                return psql.connect().then(() => {
                    return psql.disconnect().then((result) => {
                        assert.isTrue(result);
                    });
                });
            });
            it('should resolve to false if disconnection fails', () => {
                return getConnection()
                    .disconnect()
                    .then((result) => {
                        assert.isFalse(result);
                    });
            });
            it('should emit a "db-disconnect" event on success', () => {
                const psql = getConnection();
                let eventCount = 0;
                psql.on('db-disconnect', () => ++eventCount);
                psql.connect().then(() => {
                    psql.disconnect().then(() => {
                        assert.equal(eventCount, 1);
                    });
                });
            });
            it('should not emit a "db-disconnect" event on failure', () => {
                const psql = getConnection();
                let eventCount = 0;
                psql.on('db-disconnect', () => ++eventCount);
                psql.disconnect().then(() => {
                    assert.equal(eventCount, 0);
                });
            });
        });
    });
    describe('send', () => {
        describe('(query, bound = []) signature', () => {
            it('should return a Promise');
            it('should resolve to the results of the query');
        });
    });
    describe('table', () => {
        describe('(tableName) signature', () => {
            it('should return a QueryBuilder object');
            it('should set itself as the QueryBuilder\'s parent connection');
            it('should use <tableName> as the QueryBuilder\'s table');
        });
    });
});
