/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert          = requireLib('util/assert');
const PostgresDb      = requireLib('db/relational/postgresql/connection');
const PostgresDialect = requireLib('db/relational/postgresql/dialect');
const QueryBuilder    = requireLib('db/relational/query-builder');
const config          = require('./config');

const CLASS_NAME    = PostgresDb.name;
const { PART_RAW_TABLE } = requireLib('db/relational/parts');
const { $protected }   = requireLib('util/scope')();

const connections   = [];
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
                const psql   = getConnection();
                const result = psql.connect();
                assert.instanceOf(result, Promise);
                return Promise.resolve(result)
                    .then(() => psql.disconnect());
            });
            it('should resolve to false if connection fails', () => {
                const psql = getConnection({});
                return psql.connect()
                    .then((result) => assert.isFalse(result));
            });
            it('should resolve to true if connection succeeds', () => {
                const psql = getConnection();
                return psql.connect()
                    .then((result) => psql.disconnect().then(() => result))
                    .then((result) => assert.isTrue(result));
            });
            it('should emit a "db-connect" event on success', () => {
                const psql = getConnection();
                let eventCount = 0;
                psql.on('db-connect', () => ++eventCount);
                return psql.connect()
                    .then(() => psql.disconnect())
                    .then(() => assert.equal(eventCount, 1));
            });
            it('should not emit a "db-connect" event on failure', () => {
                const psql = getConnection();
                let eventCount = 0;
                psql.on('db-connect', () => ++eventCount);

                return Promise.resolve()
                    .then(() => psql.connect())
                    .then(() => psql.connect())
                    .then(() => psql.disconnect())
                    .then(() => assert.equal(eventCount, 1));
            });
        });
    });
    describe('disconnect', () => {
        describe('() signature', () => {
            it('should return a Promise', () => {
                const psql = getConnection();
                const result = psql.connect();
                assert.instanceOf(result, Promise);
                return Promise.resolve(result)
                    .then(() => psql.disconnect());
            });
            it('should resolve to true if disconnect succeeds', () => {
                const psql = getConnection();
                return psql.connect()
                    .then(() => psql.disconnect())
                    .then((result) => assert.isTrue(result));
            });
            it('should resolve to false if disconnection fails', () => {
                return getConnection()
                    .disconnect()
                    .then((result) => assert.isFalse(result));
            });
            it('should emit a "db-disconnect" event on success', () => {
                const psql = getConnection();
                let eventCount = 0;
                psql.on('db-disconnect', () => ++eventCount);
                return psql.connect()
                    .then(() => psql.disconnect())
                    .then(() => assert.equal(eventCount, 1));
            });
            it('should not emit a "db-disconnect" event on failure', () => {
                const psql = getConnection();
                let eventCount = 0;
                psql.on('db-disconnect', () => ++eventCount);
                return psql.disconnect().then(() => {
                    assert.equal(eventCount, 0);
                });
            });
        });
    });
    describe('connected', () => {
        describe('() signature', () => {
            it('should return false if the connection is closed', () => {
                const psql = getConnection();
                assert.isFalse(psql.connected());
            });
            it('should return true if the connection is open', () => {
                const psql = getConnection();
                return psql.connect()
                    .then(() => assert.isTrue(psql.connected()))
                    .then(() => psql.disconnect());
            });
        });
    });
    describe('send', () => {
        describe('(query, bound = []) signature', () => {
            it('should return a Promise', () => {
                const psql = getConnection();
                return psql.connect()
                    .then(() => {
                        assert.instanceOf(psql.send('SELECT NOW()'), Promise);
                        return psql.disconnect();
                    });
            });
            it('should resolve to the results of the query', () => {
                const psql = getConnection();
                return psql.connect()
                    .then(() => psql.send('SELECT NOW()'))
                    .then((rows) => psql.disconnect()
                        .then(() => assert.isArray(rows))
                    );
            });
        });
    });
    describe('table', () => {
        describe('(tableName) signature', () => {
            it('should return a QueryBuilder object', () => {
                const psql = getConnection();
                assert.instanceOf(psql.table('table'), QueryBuilder);
            });
            it(
                'should set itself as the QueryBuilder\'s parent connection',
                () => {
                    const psql = getConnection();
                    assert.equal(
                        $protected(psql.table('table')).connection,
                        psql
                    );
                }
            );
            it('should use <tableName> as the QueryBuilder\'s table', () => {
                const psql = getConnection();
                const tableName = 'table';
                assert.equal(
                    $protected(psql.table(tableName)).parts.get(PART_RAW_TABLE),
                    tableName
                );
            });
            it('should use the PostgreSQL Query Dialect', () => {
                const psql = getConnection();
                assert.instanceOf(
                    $protected(psql.table('table')).dialect,
                    PostgresDialect
                );
            });
        });
    });
});
