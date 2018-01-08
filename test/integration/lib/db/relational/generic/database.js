/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert         = require('regent/lib/util/assert');
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

module.exports = function(testGroup, options) {
    const localRegent = global.newRegent();
    const database    = new Database(localRegent, options);

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
            describe('(<query>) signature', () => {
                it('should return a Promise');
                it('should resolve to a Collection of Records');
            });
            describe('(<query>, <bound>) signature', () => {
                it('should return a Promise');
                it('should resolve to a Collection of Records');
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
