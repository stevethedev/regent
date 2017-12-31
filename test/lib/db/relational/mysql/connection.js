/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert             = requireLib('util/assert');
const MysqlDb            = requireLib('db/relational/mysql/connection');
const MysqlDialect       = requireLib('db/relational/mysql/dialect');
const QueryBuilder       = requireLib('db/relational/query-builder');
const config             = require('./config');

const CLASS_NAME         = MysqlDb.name;
const { PART_RAW_TABLE } = requireLib('db/relational/parts');
const { $protected }     = requireLib('util/scope')();

const connections        = [];
const getConnection      = (options = config) => {
    const connection = MysqlDb.create(options);
    connections.push(connection);
    return connection;
};

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        describe('(options) signature', () => {
            xit('should add a table prefix if options.prefix is set', () => {
                const prefix = 'my-prefix';
                const mysql = getConnection({ prefix });
                assert.equal(mysql.getPrefix(), prefix);
            });
        });
    });
    describe('connect', () => {
        describe('() signature', () => {
            xit('should return a Promise', () => {
                const mysql   = getConnection();
                const result = mysql.connect();
                assert.instanceOf(result, Promise);
                return Promise.resolve(result)
                    .then(() => mysql.disconnect());
            });
            xit('should resolve to false if connection fails', () => {
                const mysql = getConnection({});
                return mysql.connect()
                    .then((result) => assert.isFalse(result));
            });
            xit('should resolve to true if connection succeeds', () => {
                const mysql = getConnection();
                return mysql.connect()
                    .then((result) => mysql.disconnect().then(() => result))
                    .then((result) => assert.isTrue(result));
            });
            xit('should emit a "db-connect" event on success', () => {
                const mysql = getConnection();
                let eventCount = 0;
                mysql.on('db-connect', () => ++eventCount);
                return mysql.connect()
                    .then(() => mysql.disconnect())
                    .then(() => assert.equal(eventCount, 1));
            });
            xit('should not emit a "db-connect" event on failure', () => {
                const mysql = getConnection();
                let eventCount = 0;
                mysql.on('db-connect', () => ++eventCount);

                return Promise.resolve()
                    .then(() => mysql.connect())
                    .then(() => mysql.connect())
                    .then(() => mysql.disconnect())
                    .then(() => assert.equal(eventCount, 1));
            });
        });
    });
    describe('disconnect', () => {
        describe('() signature', () => {
            xit('should return a Promise', () => {
                const mysql = getConnection();
                const result = mysql.connect();
                assert.instanceOf(result, Promise);
                return Promise.resolve(result)
                    .then(() => mysql.disconnect());
            });
            xit('should resolve to true if disconnect succeeds', () => {
                const mysql = getConnection();
                return mysql.connect()
                    .then(() => mysql.disconnect())
                    .then((result) => assert.isTrue(result));
            });
            xit('should resolve to false if disconnection fails', () => {
                return getConnection()
                    .disconnect()
                    .then((result) => assert.isFalse(result));
            });
            xit('should emit a "db-disconnect" event on success', () => {
                const mysql = getConnection();
                let eventCount = 0;
                mysql.on('db-disconnect', () => ++eventCount);
                return mysql.connect()
                    .then(() => mysql.disconnect())
                    .then(() => assert.equal(eventCount, 1));
            });
            xit('should not emit a "db-disconnect" event on failure', () => {
                const mysql = getConnection();
                let eventCount = 0;
                mysql.on('db-disconnect', () => ++eventCount);
                return mysql.disconnect().then(() => {
                    assert.equal(eventCount, 0);
                });
            });
        });
    });
    describe('connected', () => {
        describe('() signature', () => {
            xit('should return false if the connection is closed', () => {
                const mysql = getConnection();
                assert.isFalse(mysql.connected());
            });
            xit('should return true if the connection is open', () => {
                const mysql = getConnection();
                return mysql.connect()
                    .then(() => assert.isTrue(mysql.connected()))
                    .then(() => mysql.disconnect());
            });
        });
    });
    describe('send', () => {
        describe('(query, bound = []) signature', () => {
            xit('should return a Promise', () => {
                const mysql = getConnection();
                return mysql.connect()
                    .then(() => {
                        assert.instanceOf(mysql.send('SELECT NOW()'), Promise);
                        return mysql.disconnect();
                    });
            });
            xit('should resolve to the results of the query', () => {
                const mysql = getConnection();
                return mysql.connect()
                    .then(() => mysql.send('SELECT NOW()'))
                    .then((rows) => mysql.disconnect()
                        .then(() => assert.isArray(rows))
                    );
            });
        });
    });
    describe('table', () => {
        describe('(tableName) signature', () => {
            xit('should return a QueryBuilder object', () => {
                const mysql = getConnection();
                assert.instanceOf(mysql.table('table'), QueryBuilder);
            });
            xit(
                'should set itself as the QueryBuilder\'s parent connection',
                () => {
                    const mysql = getConnection();
                    assert.equal(
                        $protected(mysql.table('table')).connection,
                        mysql
                    );
                }
            );
            xit('should use <tableName> as the QueryBuilder\'s table', () => {
                const mysql = getConnection();
                const tableName = 'table';
                assert.equal(
                    $protected(mysql.table(tableName)).parts.get(PART_RAW_TABLE),
                    tableName
                );
            });
            xit('should use the MySQL Query Dialect', () => {
                const mysql = getConnection();
                assert.instanceOf(
                    $protected(mysql.table('table')).dialect,
                    MysqlDialect
                );
            });
        });
    });
});
