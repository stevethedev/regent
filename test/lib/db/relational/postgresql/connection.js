/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert        = requireLib('util/assert');
const PgConnection  = requireLib('db/relational/postgresql/connection');

const CLASS_NAME    = PgConnection.name;

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        describe('(options) signature', () => {
            it('should add a table prefix if options.prefix is set');
        });
    });
    describe('connect', () => {
        describe('() signature', () => {
            it('should throw an error if connection fails');
            it('should connect to the database');
            it('should emit a "db-connect" event on success');
            it('should not emit a "db-connect" event on failure');
            it('should return a Promise');
            it('should resolve to the connection object');
        });
    });
    describe('disconnect', () => {
        describe('() signature', () => {
            it('should throw an error if disconnection fails');
            it('should disconnect from the database');
            it('should emit a "db-disconnect" event on success');
            it('should not emit a "db-disconnect" event on failure');
            it('should return a Promise');
            it('should resolve to the connection object');
        });
    });
    describe('send', () => {
        describe('(query, bound = []) signature', () => {
            it('should return a Promise');
            it('should resolve to the results of the query');
        });
    });
    describe('table', () => {
        describe('(tableName) signature', () => {
            it('should return a QueryBuilder object');
            it('should set itself as the QueryBuilder\'s parent connection');
            it('should use <tableName> as the QueryBuilder\'s table');
        });
    });
});
