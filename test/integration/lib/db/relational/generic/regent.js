/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert        = require('regent/lib/util/assert');
const Regent        = require('regent/lib/core/regent');
const DatabaseClass = require('regent/lib/db/database');
const { newRegent } = global;

const CLASS_NAME    = Regent.name;
const DB_NAME       = 'test_database';

module.exports = function(testGroup, dbOptions) {
    describe(`${testGroup} ${CLASS_NAME} execution methods`, () => {
        const Database = { [DB_NAME]: dbOptions };
        const database = {
            connections: [DB_NAME],
            default    : DB_NAME,
        };
        const regent = newRegent({ Database }, { database });

        // This is a neat trick to wait until connected to continue.
        before(() => {
            let started = false;
            regent.getEmitter().on('db-connect', () => {
                started = true;
            });

            regent.start();

            return new Promise((resolve) => {
                const timer = setInterval(() => {
                    if (started) {
                        clearInterval(timer);
                        resolve();
                    }
                });
            });
        });
        after(() => regent.stop());
        describe('getDb method', () => {
            describe('() signature', () => {
                it(`should return a ${DatabaseClass.name} object`, () => {
                    assert.instanceOf(regent.getDb(), DatabaseClass);
                });
                it('should automatically connect to the read server', () => {
                    const readConnection = regent.getDb().read();
                    assert.isTrue(readConnection.isConnected());
                });
                it('should automatically connect to the write server', () => {
                    const writeConnection = regent.getDb().write();
                    assert.isTrue(writeConnection.isConnected());
                });
            });
            describe('(name) signature', () => {
                it(`should return a ${DatabaseClass.name} object`, () => {
                    assert.instanceOf(regent.getDb(DB_NAME), DatabaseClass);
                });
                it('should automatically connect to the read server', () => {
                    const readConnection = regent.getDb(DB_NAME).read();
                    assert.isTrue(readConnection.isConnected());
                });
                it('should automatically connect to the write server', () => {
                    const writeConnection = regent.getDb(DB_NAME).write();
                    assert.isTrue(writeConnection.isConnected());
                });
            });
        });
    });
};
