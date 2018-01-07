/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert         = require('regent/lib/util/assert');
const Database       = require('regent/lib/db/database');
const GenericDb      = require('regent/lib/db/relational/connection');
const { $protected } = require('regent/lib/util/scope')();

const CLASS_NAME     = Database.name;

const DB_DRIVER      = 'GenericDb';

const { newRegent } = global;

Database.registerDriver(DB_DRIVER, GenericDb);

const getDatabase  = () => {
    const localRegent = newRegent();
    const read        = { bar: 'bar' };
    const write       = { baz: 'baz' };
    const settings    = {
        driver: DB_DRIVER,
        read,
        write,
    };
    const database    = new Database(localRegent, settings);
    return database;
};

describe(`The ${CLASS_NAME} class`, () => {
    describe('static registerDriver', () => {
        describe('(<name>, <class>) signature', () => {
            it('should register the driver class', () => {
                assert.equal(
                    Database.getDriverConstructor(DB_DRIVER),
                    GenericDb
                );
            });
        });
    });
    describe('constructor', () => {
        describe('(regent, driver, { read, write, options }) signature', () => {
            const localRegent = newRegent();
            const options     = {
                bar: 'foo',
                baz: 'foo',
                foo: 'foo',
            };
            const read        = { bar: 'bar' };
            const write       = { baz: 'baz' };
            const settings    = {
                driver: DB_DRIVER,
                options,
                read,
                write,
            };
            const database    = new Database(localRegent, settings);
            const $database   = $protected(database);
            it('should use different connections for read and write', () => {
                assert.notEqual(database.read(), database.write());
            });
            it('should fill in the "read" connection with "options"', () => {
                assert.equal($database.options.read.foo, options.foo);
            });
            it('should fill in the "write" connection with "options"', () => {
                assert.equal($database.options.write.foo, options.foo);
            });
            it('should prioritize the "read" connection over "options"', () => {
                assert.equal($database.options.read.bar, read.bar);
            });
            it(
                'should prioritize the "write" connection over "options"',
                () => {
                    assert.equal($database.options.write.baz, write.baz);
                }
            );
        });
        describe('(regent, driver, { read, options }) signature', () => {
            const localRegent = newRegent();
            const options     = {
                bar: 'foo',
                baz: 'foo',
                foo: 'foo',
            };
            const read        = { bar: 'bar' };
            const settings    = {
                driver: DB_DRIVER,
                options,
                read,
            };
            const database    = new Database(localRegent, settings);
            const $database   = $protected(database);
            it('should use different connections for read and write', () => {
                assert.notEqual(database.read(), database.write());
            });
            it('should fill in the "read" connection with "options"', () => {
                assert.equal($database.options.read.foo, options.foo);
            });
            it('should prioritize the "read" connection over "options"', () => {
                assert.equal($database.options.read.bar, read.bar);
            });
            it('should use "options" for the "write" connection', () => {
                assert.equal($database.options.write.foo, options.foo);
                assert.equal($database.options.write.bar, options.bar);
                assert.equal($database.options.write.baz, options.baz);
            });
        });
        describe('(regent, driver, { write, options }) signature', () => {
            const localRegent = newRegent();
            const options     = {
                bar: 'foo',
                baz: 'foo',
                foo: 'foo',
            };
            const write       = { baz: 'baz' };
            const settings    = {
                driver: DB_DRIVER,
                options,
                write,
            };
            const database    = new Database(localRegent, settings);
            const $database   = $protected(database);
            it('should use different connections for read and write', () => {
                assert.notEqual(database.read(), database.write());
            });
            it('should fill in the "write" connection with "options"', () => {
                assert.equal($database.options.write.foo, options.foo);
            });
            it(
                'should prioritize the "write" connection over "options"',
                () => {
                    assert.equal($database.options.write.baz, write.baz);
                }
            );
            it('should use "options" for the "read" connection', () => {
                assert.equal($database.options.read.foo, options.foo);
                assert.equal($database.options.read.bar, options.bar);
                assert.equal($database.options.read.baz, options.baz);
            });
        });
        describe('(regent, driver, { read, write }) signature', () => {
            const localRegent = newRegent();
            const read        = { bar: 'bar' };
            const write       = { baz: 'baz' };
            const settings    = {
                driver: DB_DRIVER,
                read,
                write,
            };
            const database    = new Database(localRegent, settings);
            it('should use different connections for read and write', () => {
                assert.notEqual(database.read(), database.write());
            });
        });
        describe('(regent, driver, { options } signature', () => {
            const localRegent = newRegent();
            const options     = {
                bar: 'foo',
                baz: 'foo',
                foo: 'foo',
            };
            const settings    = {
                driver: DB_DRIVER,
                options,
            };
            const database    = new Database(localRegent, settings);
            it('should use the same connection for read and write', () => {
                assert.equal(database.read(), database.write());
            });
        });
    });
    describe('select method', () => {
        const localRegent = newRegent();
        const database = new Database(localRegent, {
            driver: DB_DRIVER,
            read  : { foo: 'foo' },
            write : { bar: 'bar' },
        });
        describe('(<query>) signature', () => {
            const QUERY = 'SELECT * FROM table';
            it('should execute the query on the "read" connection', () => {
                let executed = false;
                database.read().query = (query) => {
                    executed = true;
                    assert.equal(query, QUERY);
                };
                database.select(QUERY);
                assert.isTrue(executed);
            });
            it('should forward an empty array to the <bound> argument', () => {
                database.read().query = (query, bound) => {
                    assert.isArray(bound);
                    assert.equal(bound.length, 0);
                };
                return database.select(QUERY);
            });
            it('should not execute the query on the "write" connection', () => {
                let executed = false;
                database.write().query = () => {
                    executed = true;
                };
                database.select(QUERY);
                assert.isFalse(executed);
            });
        });
        describe('(<query>, <bound>) signature', () => {
            const QUERY = 'SELECT * FROM table';
            const BOUND = ['foo'];
            it('should execute the query on the "read" connection', () => {
                let executed = false;
                database.read().query = (query, bound) => {
                    executed = true;
                    assert.equal(query, QUERY);
                    assert.equal(bound, BOUND);
                };
                database.select(QUERY, BOUND);
                assert.isTrue(executed);
            });
            it('should forward <bound> to the "read" connection', () => {
                database.read().query = (query, bound) => {
                    assert.isArray(bound);
                    assert.equal(bound.length, BOUND.length);
                };
                return database.select(QUERY, BOUND);
            });
            it('should not execute the query on the "write" connection', () => {
                let executed = false;
                database.write().query = () => {
                    executed = true;
                };
                database.select(QUERY, BOUND);
                assert.isFalse(executed);
            });
        });
    });
    describe('insert method', () => {
        const localRegent = newRegent();
        const database = new Database(localRegent, {
            driver: DB_DRIVER,
            read  : { foo: 'foo' },
            write : { bar: 'bar' },
        });
        describe('(<query>) signature', () => {
            const QUERY = 'INSERT INTO table (field) VALUES (\'value\')';
            it('should not execute the query on the "read" connection', () => {
                let executed = false;
                database.read().query = () => {
                    executed = true;
                };
                database.write().query = () => true;
                database.insert(QUERY);
                assert.isFalse(executed);
            });
            it('should execute the query on the "write" connection', () => {
                let executed = false;
                database.write().query = () => {
                    executed = true;
                };
                database.insert(QUERY);
                assert.isTrue(executed);
            });
            it('should forward an empty array to the <bound> argument', () => {
                database.write().query = (query, bound) => {
                    assert.equal(query, QUERY);
                    assert.isArray(bound);
                    assert.equal(bound.length, 0);
                };
                return database.insert(QUERY);
            });
        });
        describe('(<query>, <bound>) signature', () => {
            const QUERY = 'INSERT INTO table (field) VALUES ({0})';
            const BOUND = ['foo'];
            it('should not execute the query on the "read" connection', () => {
                let executed = false;
                database.write().query = () => null;
                database.read().query = () => {
                    executed = true;
                };
                database.insert(QUERY, BOUND);
                assert.isFalse(executed);
            });
            it('should execute the query on the "write" connection', () => {
                let executed = false;
                database.write().query = () => {
                    executed = true;
                };
                database.insert(QUERY, BOUND);
                assert.isTrue(executed);
            });
            it('should forward <bound> to the "write" connection', () => {
                database.write().query = (query, bound) => {
                    assert.equal(query, QUERY);
                    assert.isArray(bound);
                    assert.equal(bound.length, BOUND.length);
                };
                return database.insert(QUERY, BOUND);
            });
        });
    });
    describe('update method', () => {
        const localRegent = newRegent();
        const database = new Database(localRegent, {
            driver: DB_DRIVER,
            read  : { foo: 'foo' },
            write : { bar: 'bar' },
        });
        describe('(<query>) signature', () => {
            const QUERY = 'UPDATE table SET field = \'value\'';
            it('should not execute the query on the "read" connection', () => {
                let executed = false;
                database.read().query = () => {
                    executed = true;
                };
                database.write().query = () => true;
                database.update(QUERY);
                assert.isFalse(executed);
            });
            it('should execute the query on the "write" connection', () => {
                let executed = false;
                database.write().query = () => {
                    executed = true;
                };
                database.update(QUERY);
                assert.isTrue(executed);
            });
            it('should forward an empty array to the <bound> argument', () => {
                database.write().query = (query, bound) => {
                    assert.equal(query, QUERY);
                    assert.isArray(bound);
                    assert.equal(bound.length, 0);
                };
                return database.update(QUERY);
            });
        });
        describe('(<query>, <bound>) signature', () => {
            const QUERY = 'UPDATE table SET field = {0}';
            const BOUND = ['foo'];
            it('should not execute the query on the "read" connection', () => {
                let executed = false;
                database.write().query = () => null;
                database.read().query = () => {
                    executed = true;
                };
                database.update(QUERY, BOUND);
                assert.isFalse(executed);
            });
            it('should execute the query on the "write" connection', () => {
                let executed = false;
                database.write().query = () => {
                    executed = true;
                };
                database.update(QUERY, BOUND);
                assert.isTrue(executed);
            });
            it('should forward <bound> to the "write" connection', () => {
                database.write().query = (query, bound) => {
                    assert.equal(query, QUERY);
                    assert.isArray(bound);
                    assert.equal(bound.length, BOUND.length);
                };
                return database.update(QUERY, BOUND);
            });
        });
    });
    describe('delete method', () => {
        const localRegent = newRegent();
        const database = new Database(localRegent, {
            driver: DB_DRIVER,
            read  : { foo: 'foo' },
            write : { bar: 'bar' },
        });
        describe('(<query>) signature', () => {
            const QUERY = 'DELETE FROM table';
            it('should not execute the query on the "read" connection', () => {
                let executed = false;
                database.read().query = () => {
                    executed = true;
                };
                database.write().query = () => true;
                database.delete(QUERY);
                assert.isFalse(executed);
            });
            it('should execute the query on the "write" connection', () => {
                let executed = false;
                database.write().query = () => {
                    executed = true;
                };
                database.delete(QUERY);
                assert.isTrue(executed);
            });
            it('should forward an empty array to the <bound> argument', () => {
                database.write().query = (query, bound) => {
                    assert.equal(query, QUERY);
                    assert.isArray(bound);
                    assert.equal(bound.length, 0);
                };
                return database.delete(QUERY);
            });
        });
        describe('(<query>, <bound>) signature', () => {
            const QUERY = 'DELETE FORM table WHERE field = {0}';
            const BOUND = ['foo'];
            it('should not execute the query on the "read" connection', () => {
                let executed = false;
                database.write().query = () => null;
                database.read().query = () => {
                    executed = true;
                };
                database.delete(QUERY, BOUND);
                assert.isFalse(executed);
            });
            it('should execute the query on the "write" connection', () => {
                let executed = false;
                database.write().query = () => {
                    executed = true;
                };
                database.delete(QUERY, BOUND);
                assert.isTrue(executed);
            });
            it('should forward <bound> to the "write" connection', () => {
                database.write().query = (query, bound) => {
                    assert.equal(query, QUERY);
                    assert.isArray(bound);
                    assert.equal(bound.length, BOUND.length);
                };
                return database.delete(QUERY, BOUND);
            });
        });
    });
    describe('statement method', () => {
        const localRegent = newRegent();
        const database = new Database(localRegent, {
            driver: DB_DRIVER,
            read  : { foo: 'foo' },
            write : { bar: 'bar' },
        });
        describe('(<query>) signature', () => {
            const QUERY = 'CREATE TABLE table (field TEXT)';
            it('should not execute the query on the "read" connection', () => {
                let executed = false;
                database.read().query = () => {
                    executed = true;
                };
                database.write().query = () => true;
                database.statement(QUERY);
                assert.isFalse(executed);
            });
            it('should execute the query on the "write" connection', () => {
                let executed = false;
                database.write().query = () => {
                    executed = true;
                };
                database.statement(QUERY);
                assert.isTrue(executed);
            });
            it('should forward an empty array to the <bound> argument', () => {
                database.write().query = (query, bound) => {
                    assert.equal(query, QUERY);
                    assert.isArray(bound);
                    assert.equal(bound.length, 0);
                };
                return database.statement(QUERY);
            });
        });
        describe('(<query>, <bound>) signature', () => {
            const QUERY = 'CREATE TABLE table (field TEXT DEFAULT {0})';
            const BOUND = ['foo'];
            it('should not execute the query on the "read" connection', () => {
                let executed = false;
                database.write().query = () => null;
                database.read().query = () => {
                    executed = true;
                };
                database.statement(QUERY, BOUND);
                assert.isFalse(executed);
            });
            it('should execute the query on the "write" connection', () => {
                let executed = false;
                database.write().query = () => {
                    executed = true;
                };
                database.statement(QUERY, BOUND);
                assert.isTrue(executed);
            });
            it('should forward <bound> to the "write" connection', () => {
                database.write().query = (query, bound) => {
                    assert.equal(query, QUERY);
                    assert.isArray(bound);
                    assert.equal(bound.length, BOUND.length);
                };
                return database.statement(QUERY, BOUND);
            });
        });
    });
    describe('read method', () => {
        describe('() signature', () => {
            it('should return a reference to the "read" connection', () => {
                const database = getDatabase();
                assert.instanceOf(database.read(), GenericDb);
            });
        });
    });
    describe('write method', () => {
        describe('() signature', () => {
            it('should return a reference to the "write" connection', () => {
                const database = getDatabase();
                assert.instanceOf(database.write(), GenericDb);
            });
        });
    });
});
