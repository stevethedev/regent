/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const DbSchema    = require('regent-js/lib/db/schema/db');
const TableSchema = require('regent-js/lib/db/schema/table');

const CLASS_NAME  = DbSchema.name;

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        describe('(<regent>, <connection>) signature', () => {
            it('should use the defined <connection>');
            it(`should return a ${CLASS_NAME}`);
        });
        describe('(<regent>) signature', () => {
            it('should default to using the default <connection>');
            it(`should return a ${CLASS_NAME}`);
        });
    });
    describe('createTable method', () => {
        describe('(<tableName>) signature', () => {
            it(`should return a ${TableSchema.name} instance`);
            it(`should set the ${TableSchema.name} instance name to <tableName>`);
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
            it('should drop <tableName>');
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('dropTableIfExists method', () => {
        describe('(<tableName>) signature', () => {
            it('should drop <tableName> if it exists');
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('getTable method', () => {
        describe('(<tableName>) signature', () => {
            it(`should return a ${TableSchema.name}`);
            it(`should set the ${TableSchema.name} name to <tableName>`);
        });
    });
    describe('setForeignKeyConstraints method', () => {
        describe('(<state>) signature', () => {
            it('should set the foreign key constraints to <state>');
            it(`should return the ${CLASS_NAME}`);
        });
    });
});
