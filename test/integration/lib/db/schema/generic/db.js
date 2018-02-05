/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert      = require('regent-js/lib/util/assert');
const DbSchema    = require('regent-js/lib/db/schema/db');
const TableSchema = require('regent-js/lib/db/schema/table');

const CLASS_NAME  = DbSchema.name;

module.exports = function(testGroup, connectionName, settings) {
    const regent = global.newRegent(settings);
    describe(`${testGroup} ${CLASS_NAME} class`, () => {
        const SUITE = { tableName: 'db_schema' };

        before(async () => {
            await regent.start();
            SUITE.connection = regent.getDb(connectionName).write();
        });
        after(async () => {
            SUITE.connection.send(
                `DROP TABLE IF EXISTS ${SUITE.tableName}`
            );
            await regent.stop();
        });

        describe('createTable method', () => {
            describe('(<tableName>) signature', () => {
                const test = {};
                before(() => {
                    test.tableName = SUITE.tableName;
                    test.schema = SUITE.connection.getSchema();
                    test.table = test.schema.createTable(test.tableName);
                });
                it(`should return a ${TableSchema.name} instance`, () => {
                    assert.instanceOf(test.table, TableSchema);
                });
                it(
                    `should set the ${TableSchema.name} instance name to `
                        + '<tableName>',
                    () => assert.equal(test.table.getName(), test.tableName)
                );
            });
        });
        describe('hasTable method', () => {
            describe('(<tableName>) signature', () => {
                it('should return a Promise');
                it('should resolve to true if <tableName> exists');
                it('should resolve to false if <tableName> does not exist');
            });
        });
        describe('renameTable method', () => {
            describe('(<oldName>, <newName>) signature', () => {
                it('should return a Promise');
                it('should resolve to true if the table was renamed');
                it('should throw an error if the table was not renamed');
            });
        });
        describe('hasColumn method', () => {
            describe('(<tableName>, <columnName>) signature', () => {
                it('should return a Promise');
                it('should resolve to true if <tableName>.<columnName> exists');
                it('should resolve to false if <tableName>.<columnName> does not exist');
            });
        });
        describe('setConnection method', () => {
            describe('(<connection>) signature', () => {
                it('should set the internal connection to <connection>');
                it(`should return the ${CLASS_NAME}`);
            });
        });
        describe('dropTable method', () => {
            describe('(<tableName>) signature', () => {
                it('should return a Promise');
                it('should remove the table named <tableName>');
                it('should resolve to TRUE if deletion was successful');
            });
        });
        describe('dropTableIfExists method', () => {
            describe('(<tableName>) signature', () => {
                it('should drop <tableName> if it exists');
                it('should return a Promise');
                it('should resolve to TRUE if the deletion was successful');
                it('should resolve to FALSE if the deletion was successful');
            });
        });
        describe('getTable method', () => {
            describe('(<tableName>) signature', () => {
                it('should return a Promise');
                it(`should resolve to a ${TableSchema.name} if it exists`);
                it(`should set the ${TableSchema.name} name to <tableName>`);
                it('should throw an error if <tableName> does not exist');
            });
        });
        describe('setForeignKeyConstraints method', () => {
            describe('(<state>) signature', () => {
                it('should set the foreign key constraints to <state>');
                it(`should return the ${CLASS_NAME}`);
            });
        });
    });
};
