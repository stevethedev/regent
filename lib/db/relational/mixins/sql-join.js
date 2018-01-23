/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const { $protected } = require('regent-js/lib/util/scope').create();
const { PART_JOIN }  = require('regent-js/lib/db/relational/parts');

const Mixin = {
    /**
     * Add a CROSS JOIN clause to the query
     *
     * @method crossJoin
     *
     * @param {Object|String} tableDef
     *
     * @return {this}
     */
    crossJoin(tableDef) {
        const { alias, table } = this.call(parseTableDef, tableDef);
        const { dialect } = $protected(this);
        return this.crossJoinRaw(
            dialect.table(table, alias)
        );
    },

    /**
     * Add a CROSS JOIN clause to the query
     *
     * @method crossJoinRaw
     *
     * @param {String}  signature
     * @param {Mixed[]} values
     *
     * @return {this}
     */
    crossJoinRaw(signature) {
        $protected(this).parts.get(PART_JOIN).push({
            signature,
            type  : 'CROSS',
            values: [],
        });
        return this;
    },

    /**
     * Add an INNER JOIN clause to the query
     *
     * @method join
     *
     * @param {Object|String} tableDef
     * @param {String}        localKey
     * @param {String}        [operator='=']
     * @param {String}        [remoteKey=localKey]
     *
     * @return {this}
     */
    join(tableDef, ...args) {
        return this.joinRaw(this.call(getJoinString, tableDef, args));
    },

    /**
     * Add an INNER JOIN clause to the query
     *
     * @method joinRaw
     *
     * @param {String}  signature
     * @param {Mixed[]} [values=]
     *
     * @return {this}
     */
    joinRaw(signature, values = []) {
        $protected(this).parts.get(PART_JOIN).push({
            signature,
            type: 'INNER',
            values,
        });
        return this;
    },

    /**
     * Add an LEFT JOIN clause to the query
     *
     * @method join
     *
     * @param {Object|String} tableDef
     * @param {String}        localKey
     * @param {String}        [operator='=']
     * @param {String}        [remoteKey=localKey]
     *
     * @return {this}
     */
    leftJoin(tableDef, ...args) {
        return this.leftJoinRaw(this.call(getJoinString, tableDef, args));
    },

    /**
     * Add a LEFT JOIN clause to the query
     *
     * @method leftJoinRaw
     *
     * @param {String}  signature
     * @param {Mixed[]} values
     *
     * @return {this}
     */
    leftJoinRaw(signature, values = []) {
        $protected(this).parts.get(PART_JOIN).push({
            signature,
            type: 'LEFT',
            values,
        });
        return this;
    },

    /**
     * Add an RIGHT JOIN clause to the query
     *
     * @method join
     *
     * @param {Object|String} tableDef
     * @param {String}        localKey
     * @param {String}        [operator='=']
     * @param {String}        [remoteKey=localKey]
     *
     * @return {this}
     */
    rightJoin(tableDef, ...args) {
        return this.rightJoinRaw(this.call(getJoinString, tableDef, args));
    },

    /**
     * Add a RIGHT JOIN clause to the query
     *
     * @method rightJoinRaw
     *
     * @param {String}  signature
     * @param {Mixed[]} values
     *
     * @return {this}
     */
    rightJoinRaw(signature, values = []) {
        $protected(this).parts.get(PART_JOIN).push({
            signature,
            type: 'RIGHT',
            values,
        });
        return this;
    },
};

/**
 * Create a SQL JOIN string
 *
 * @private
 * @method getJoinString
 *
 * @param {String|Object} tableDef
 * @param {String[]}      args
 *
 * @return {String}
 */
function getJoinString(tableDef, args) {
    const { dialect } = $protected(this);
    const { alias, table } = this.call(parseTableDef, tableDef);
    const { foreign, local, operator } = this.call(getJoinParams, args);

    const joinDef      = dialect.table(table, alias);
    const foreignTable = `${
        alias ? dialect.alias(alias) : table
    }.${foreign}`;
    return `${joinDef} ON ${foreignTable} ${operator} {this}.${local}`;
}

/**
 * Extract the <local>, <foreign>, and <operator> parameters from an array
 *
 * @method getJoinParams
 *
 * @param {String[]} args
 *
 * @return {Object}
 */
function getJoinParams(args) {
    if (1 === args.length) {
        args.push(args[0]);
    }
    if (2 === args.length) { // eslint-disable-line no-magic-numbers
        args.splice(1, 0, '=');
    }

    return {
        foreign : args[2], // eslint-disable-line no-magic-numbers
        local   : args[0],
        operator: args[1],
    };
}

/**
 * Extract the <table> and <alias> from the <tableDef>
 *
 * @private
 * @method parseTableDef
 *
 * @param {String|Object} tableDef
 *
 * @return {Object}
 */
function parseTableDef(tableDef) {
    if ('string' === typeof tableDef) {
        return {
            alias: null,
            table: tableDef,
        };
    }

    const keys = Object.keys(tableDef);
    return {
        alias: keys[0],
        table: tableDef[keys[0]],
    };
}

module.exports = function sqlJoinMixin(QueryBuilder) {
    QueryBuilder.mix(Mixin);
    QueryBuilder.extend('reset', function(part) {
        if (!part || PART_JOIN === part) {
            $protected(this).parts.set(PART_JOIN, []);
        }
        return this;
    });
};
