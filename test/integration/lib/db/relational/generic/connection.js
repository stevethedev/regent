/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert          = require('regent/lib/util/assert');
const QueryBuilder    = require('regent/lib/db/relational/query-builder');

const { PART_RAW_TABLE } = require('regent/lib/db/relational/parts');
const { $protected }   = require('regent/lib/util/scope')();

const connections   = [];
module.exports = function(testGroup, Connection, Dialect, config) {
    const CLASS_NAME    = Connection.name;
    const getConnection = (options = config) => {
        const connection = new Connection(options);
        connections.push(connection);
        return connection;
    };

    describe(`The ${testGroup} ${CLASS_NAME} class`, () => {
        describe('constructor', () => {
            describe('(options) signature', () => {
                it('should add a table prefix if options.prefix is set', () => {
                    const prefix = 'my-prefix';
                    const connection = getConnection({ prefix });
                    assert.equal(connection.getPrefix(), prefix);
                });
            });
        });
        describe('connect', () => {
            describe('() signature', () => {
                it('should return a Promise', () => {
                    const connection   = getConnection();
                    const result = connection.connect();
                    assert.isPromise(result);
                    return Promise.resolve(result)
                        .then(() => connection.disconnect());
                });
                it('should resolve to false if connection fails', () => {
                    const settings = { ...config };
                    // checking for an incorrect username lets us check for mac
                    settings.username += 'a';
                    const connection = getConnection(settings);
                    return connection.connect()
                        .then((result) => assert.isFalse(result));
                });
                it('should resolve to true if connection succeeds', () => {
                    const connection = getConnection();
                    return connection.connect()
                        .then((result) => {
                            return connection.disconnect()
                                .then(() => result);
                        })
                        .then((result) => assert.isTrue(result));
                });
                it('should emit a "db-connect" event on success', () => {
                    const connection = getConnection();
                    let eventCount = 0;
                    connection.on('db-connect', () => ++eventCount);
                    return connection.connect()
                        .then(() => connection.disconnect())
                        .then(() => assert.equal(eventCount, 1));
                });
                it('should not emit a "db-connect" event on failure', () => {
                    const connection = getConnection();
                    let eventCount = 0;
                    connection.on('db-connect', () => ++eventCount);

                    return Promise.resolve()
                        .then(() => connection.connect())
                        .then(() => connection.connect())
                        .then(() => connection.disconnect())
                        .then(() => assert.equal(eventCount, 1));
                });
            });
        });
        describe('disconnect', () => {
            describe('() signature', () => {
                it('should return a Promise', () => {
                    const connection = getConnection();
                    const result = connection.connect();
                    assert.isPromise(result);
                    return Promise.resolve(result)
                        .then(() => connection.disconnect());
                });
                it('should resolve to true if disconnect succeeds', () => {
                    const connection = getConnection();
                    return connection.connect()
                        .then(() => connection.disconnect())
                        .then((result) => assert.isTrue(result));
                });
                it('should resolve to false if disconnection fails', () => {
                    return getConnection()
                        .disconnect()
                        .then((result) => assert.isFalse(result));
                });
                it('should emit a "db-disconnect" event on success', () => {
                    const connection = getConnection();
                    let eventCount = 0;
                    connection.on('db-disconnect', () => ++eventCount);
                    return connection.connect()
                        .then(() => connection.disconnect())
                        .then(() => assert.equal(eventCount, 1));
                });
                it('should not emit a "db-disconnect" event on failure', () => {
                    const connection = getConnection();
                    let eventCount = 0;
                    connection.on('db-disconnect', () => ++eventCount);
                    return connection.disconnect().then(() => {
                        assert.equal(eventCount, 0);
                    });
                });
            });
        });
        describe('connected', () => {
            describe('() signature', () => {
                it('should return false if the connection is closed', () => {
                    const connection = getConnection();
                    assert.isFalse(connection.connected());
                });
                it('should return true if the connection is open', () => {
                    const connection = getConnection();
                    return connection.connect()
                        .then(() => assert.isTrue(connection.connected()))
                        .then(() => connection.disconnect());
                });
            });
        });
        describe('send', () => {
            describe('(query, bound = []) signature', () => {
                it('should return a Promise', () => {
                    const connection = getConnection();
                    return connection.connect()
                        .then(() => {
                            const promise = connection.send('SELECT NOW()');
                            assert.isPromise(promise);
                            return Promise.resolve(promise)
                                .then(() => connection.disconnect());
                        });
                });
                it('should resolve to the results of the query', () => {
                    const connection = getConnection();
                    return connection.connect()
                        .then(() => connection.send('SELECT NOW()'))
                        .then((rows) => connection.disconnect()
                            .then(() => assert.isArray(rows))
                        );
                });
            });
        });
        describe('table', () => {
            describe('(tableName) signature', () => {
                it('should return a QueryBuilder object', () => {
                    const connection = getConnection();
                    assert.instanceOf(connection.table('table'), QueryBuilder);
                });
                it(
                    'should set itself as the QueryBuilder parent connection',
                    () => {
                        const connection = getConnection();
                        assert.equal(
                            $protected(connection.table('table')).connection,
                            connection
                        );
                    }
                );
                it(
                    'should use <tableName> as the QueryBuilder\'s table',
                    () => {
                        const connection = getConnection();
                        const tableName = 'table';
                        const { parts } = $protected(
                            connection.table(tableName)
                        );
                        assert.equal(
                            parts.get(PART_RAW_TABLE),
                            tableName
                        );
                    }
                );
                it('should use the PostgreSQL Query Dialect', () => {
                    const connection = getConnection();
                    assert.instanceOf(
                        $protected(connection.table('table')).dialect,
                        Dialect
                    );
                });
            });
        });
    });
};
