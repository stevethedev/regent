/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const DbConnection   = requireLib('db/connection');
const ObjectMerger   = requireLib('util/object-merger');

const BASE_CONFIG = {};

class RelationalDb extends DbConnection {
    constructor(config = {}) {
        super(ObjectMerger.create().merge(BASE_CONFIG, config));
    }
}

module.exports = RelationalDb;

