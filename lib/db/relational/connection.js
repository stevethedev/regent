/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const DbConnection   = requireLib('db/connection');
const ObjectMerger   = requireLib('util/object-merger');
const { $protected } = requireLib('util/scope')();

const BASE_CONFIG    = requireLib('db/relational/config');

class RelationalDb extends DbConnection {
    constructor(config = {}) {
        super(ObjectMerger.create().merge(BASE_CONFIG, config));
    }

    /**
     * Get the table prefix
     *
     * @method getPrefix
     *
     * @return {String}
     */
    getPrefix() {
        return $protected(this).config.prefix || '';
    }
}

module.exports = RelationalDb;

