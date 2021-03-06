/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseDialect = require('regent-js/lib/db/relational/dialect');

class MysqlDialect extends BaseDialect {
    /**
     * @inheritDoc
     */
    alias(alias) {
        return `\`${alias}\``;
    }

    /**
     * @inheritDoc
     */
    value(bound, value) {
        bound.push(value);
        return '?';
    }
}

module.exports = MysqlDialect;
