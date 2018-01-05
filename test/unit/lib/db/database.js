/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert   = require('regent/lib/util/assert');
const Database = require('regent/lib/db/database');

const CLASS_NAME   = Database.name;

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

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        describe('all signatures', () => {
            EVENT_ENUM.forEach((eventName) => {
                it(`should register the ${eventName} event on Regent`);
            });
        });
        describe('(regent, { read, write, options }) signature', () => {
            it('should use different connections for read and write');
            it('should fill in the "read" connection with "options"');
            it('should fill in the "write" connection with "options"');
            it('should prioritize the "read" connection over "options"');
            it('should prioritize the "write" connection over "options"');
        });
        describe('(regent, { read, options }) signature', () => {
            it('should use different connections for read and write');
            it('should fill in the "read" connection with "options"');
            it('should use "options" for the "write" connection');
        });
        describe('(regent, { write, options }) signature', () => {
            it('should use different connections for read and write');
            it('should fill in the "read" connection with "options"');
            it('should use "options" for the "read" connection');
        });
        describe('(regent, { read, write }) signature', () => {
            it('should use different connections for read and write');
        });
        describe('(regent, { options } signature', () => {
            it('should use the same connection for read and write');
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
