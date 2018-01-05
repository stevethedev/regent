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

const { newRegent } = global;

const regent       = newRegent();
Database.registerDriver(DB_DRIVER, GenericDb);

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
        describe('all signatures', () => {
            EVENT_ENUM.forEach((eventName) => {
                it(`should register the ${eventName} event on Regent`);
            });
        });
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
                options,
                read,
                write,
            };
            const database    = new Database(localRegent, DB_DRIVER, settings);
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
                options,
                read,
            };
            const database    = new Database(localRegent, DB_DRIVER, settings);
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
                options,
                write,
            };
            const database    = new Database(localRegent, DB_DRIVER, settings);
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
                read,
                write,
            };
            const database    = new Database(localRegent, DB_DRIVER, settings);
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
            const settings    = { options };
            const database    = new Database(localRegent, DB_DRIVER, settings);
            it('should use the same connection for read and write', () => {
                assert.equal(database.read(), database.write());
            });
        });
    });
    describe('select method', () => {
        describe('(<query>) signature', () => {
            it('should execute the query on the "read" connection');
            it('should forward an empty array to the <bound> argument');
            it('should not execute the query on the "write" connection');
            it('should return a Promise');
            it('should resolve to a Collection of Records');
        });
        describe('(<query>, <bound>) signature', () => {
            it('should execute the query on the "read" connection');
            it('should forward <bound> to the "read" connection');
            it('should not execute the query on the "write" connection');
            it('should return a Promise');
            it('should resolve to a Collection of Records');
        });
    });
    describe('insert method', () => {
        describe('(<query>) signature', () => {
            it('should not execute the query on the "read" connection');
            it('should execute the query on the "write" connection');
            it('should forward an empty array to the <bound> argument');
            it('should return a Promise');
            it('should resolve to Boolean(true) if it succeeds');
            it('should resolve to Boolean(false) if it fails');
        });
        describe('(<query>, <bound>) signature', () => {
            it('should not execute the query on the "read" connection');
            it('should execute the query on the "write" connection');
            it('should forward <bound> to the "write" connection');
            it('should return a Promise');
            it('should resolve to Boolean(true) if it succeeds');
            it('should resolve to Boolean(false) if it fails');
        });
    });
    describe('update method', () => {
        describe('(<query>) signature', () => {
            it('should not execute the query on the "read" connection');
            it('should execute the query on the "write" connection');
            it('should forward an empty array to the <bound> argument');
            it('should return a Promise');
            it('should resolve to an integer of the number of updates');
            it('should resolve to 0 if the query fails');
        });
        describe('(<query>, <bound>) signature', () => {
            it('should not execute the query on the "read" connection');
            it('should execute the query on the "write" connection');
            it('should forward <bound> to the "write" connection');
            it('should return a Promise');
            it('should resolve to an integer of the number of updates');
            it('should resolve to 0 if the query fails');
        });
    });
    describe('delete method', () => {
        describe('(<query>) signature', () => {
            it('should not execute on the "read" connection');
            it('should execute the query on the "write" connection');
            it('should forward an empty array to the <bound> argument');
            it('should return a Promise');
            it('should resolve to an integer of the number of deletions');
            it('should resolve to 0 if the query fails');
        });
        describe('(<query>, <bound>) signature', () => {
            it('should not execute the query on the "read" connection');
            it('should execute the query on the "write" connection');
            it('should forward <bound> to the "write" connection');
            it('should return a Promise');
            it('should resolve to an integer of the number of deletions');
            it('should resolve to 0 if the query fails');
        });
    });
    describe('statement method', () => {
        describe('(<query>) signature', () => {
            it('should not execute on the "read" connection');
            it('should execute the query on the "write" connection');
            it('should forward an empty array to the <bound> argument');
            it('should return a Promise');
            it('should resolve to the Database object');
        });
        describe('(<query>, <bound>) signature', () => {
            it('should not execute the query on the "read" connection');
            it('should execute the query on the "write" connection');
            it('should forward <bound> to the "write" connection');
            it('should return a Promise');
            it('should resolve to the Database object');
        });
    });
    describe('read method', () => {
        describe('() signature', () => {
            it('should return a reference to the "read" connection');
        });
    });
    describe('write method', () => {
        describe('() signature', () => {
            it('should return a reference to the "write" connection');
        });
    });
});
