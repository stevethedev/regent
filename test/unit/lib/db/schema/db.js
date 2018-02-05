/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert      = require('regent-js/lib/util/assert');
const DbSchema    = require('regent-js/lib/db/schema/db');

const CLASS_NAME  = DbSchema.name;

const regent = global.newRegent();

describe(`The ${CLASS_NAME} class`, () => {
    before(() => regent.start());
    after(() => regent.stop());
    describe('constructor', () => {
        describe('(<connection>) signature', () => {
            const test = {};
            before(() => {
                test.connection = {
                    getDialect() {
                        return {};
                    },
                };
                test.schema = new DbSchema(test.connection);
            });
            it('should use the defined <connection>', () => {
                assert.equal(test.schema.getConnection(), test.connection);
            });
            it(`should return a ${CLASS_NAME}`, () => {
                assert.instanceOf(test.schema, DbSchema);
            });
        });
    });
});
