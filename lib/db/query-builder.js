/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject     = requireLib('util/base-object');
const { _protected } = requireLib('util/scope')();

class QueryBuilder extends BaseObject
{
    constructor(connection)
    {
        super();

        _protected(this).connection = connection;
    }

    /**
     * Send a connection directly to the connection
     *
     * @return {mixed} The results from the connection
     */
    raw(...args)
    {
        return _protected(this).connection.send(...args);
    }
}

module.exports = QueryBuilder;
