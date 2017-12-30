/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = requireLib('util/assert');
const QueryBuilder = requireLib('db/relational/query-builder');
const PostgresDb   = requireLib('db/relational/postgresql/connection');
const config       = require('./config');

const CLASS_NAME   = QueryBuilder.name;
const TABLE_NAME   = 'psql_execution';
const TABLE_VALUES = [
    'foo',
    'bar',
    'baz',
];
const GeneratorFunction = Object.getPrototypeOf(function* () {
    // Empty function
}).constructor;

describe(`PostgreSQL ${CLASS_NAME} execution methods`, () => {
    let psql = null;

    before(() => {
        psql = PostgresDb.create(config);
        return Promise.resolve()
            .then(() => psql.send(`DROP TABLE IF EXISTS ${TABLE_NAME}`))
            .then(() => psql.send(`CREATE TABLE ${TABLE_NAME} (test_col TEXT)`))
            .then(() => psql.send(`INSERT INTO ${TABLE_NAME} VALUES (${
                TABLE_VALUES.join('), (')
            })`));
    });

    after(() => {
        return psql.send(`DROP TABLE ${TABLE_NAME}`)
            .then(() => psql.disconnect());
    });

    describe('chunk method', () => {
        describe('(<chunk-size>) signature', () => {
            it('should return a generator-iterator', () => {
                const query = psql.table(TABLE_NAME);
                return assert.instanceOf(query.chunk(1), GeneratorFunction);
            });
            it('should iterate into a Promise', () => {
                const query = psql.table(TABLE_NAME);
                assert.instanceOf(query.chunk(1).next().value, Promise);
            });
            it('should resolve into an Array', () => {
                const query = psql.table(TABLE_NAME);
                return query.chunk(1).next().value
                    .then((result) => assert.isArray(result));
            });
        });
    });
    describe('first method', () => {
        describe('() signature', () => {
            it('should send a request to the database');
            it('should return a Promise');
            it('should resolve to a Record');
        });
    });
    describe('get method', () => {
        describe('() signature', () => {
            it('should send a request to the database');
            it('should return a Promise');
            it('should resolve to a Collection');
        });
    });
    describe('iterator method', () => {
        describe('() signature', () => {
            it('should return a generator-iterator');
            it('should iterate into Promises');
            it('should send a request to the database on each iteration');
            it('should resolve into Records');
        });
    });
    describe('last method', () => {
        describe('(<field>) signature', () => {
            it('should send a request to the database');
            it('should add "ORDER BY <DESC>" to the query');
            it('should add "LIMIT 1" to the query');
            it('should return a Promise');
            it('should resolve to a value');
        });
    });
    describe('pluck method', () => {
        describe('(<field>) signature', () => {
            it('should return a Promise');
            it('should resolve to a Collection');
            it('should only include the <field> key in the Collection');
        });
        describe('(<field>, <alias>) signature', () => {
            it('should return a Promise');
            it('should resolve to a Collection');
            it('should only include the <alias> key in the Collection');
        });
    });
    describe('value method', () => {
        describe('(<field>) signature', () => {
            it('should return a Promise');
            it('should resolve to a value');
        });
    });
});
