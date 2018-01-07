/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert         = require('regent/lib/util/assert');
const Database       = require('regent/lib/db/database');

const CLASS_NAME     = Database.name;

module.exports = function(testGroup, dbDriver, options) {
    const localRegent = global.newRegent();
    const database    = new Database(localRegent, dbDriver, { options });

    describe(`${testGroup} ${CLASS_NAME} execution methods`, () => {
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
