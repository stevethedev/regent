/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const RelationalDb   = requireLib('db/relational/connection');
const ObjectMerger   = requireLib('util/object-merger');
const { $protected } = requireLib('util/scope')();

const BASE_CONFIG    = requireLib('db/relational/postgresql/config');

class PostgresDb extends RelationalDb {
    constructor(config = {}) {
        super(ObjectMerger.create().merge(BASE_CONFIG, config));
    }
}

module.exports = PostgresDb;
