/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject      = require('regent-js/lib/util/base-object');
const RegentMap       = require('regent-js/lib/support/map');
const { $protected }  = require('regent-js/lib/util/scope')();

const SQL_UPDATE      = 'UPDATE';
const SQL_DELETE      = 'DELETE';
const SQL_INSERT      = 'INSERT INTO';
const SQL_SELECT      = 'SELECT';
const SQL_DISTINCT    = 'DISTINCT';
const SQL_FROM        = 'FROM';
const SQL_WHERE       = 'WHERE';
const SQL_SET         = 'SET';
const SQL_VALUES      = 'VALUES';
const SQL_LIMIT       = 'LIMIT';
const SQL_OFFSET      = 'OFFSET';
const SQL_ORDER       = 'ORDER BY';
const SQL_GROUP       = 'GROUP BY';
const SQL_TRUNCATE    = 'TRUNCATE TABLE';
const SQL_CASCADE     = 'CASCADE';
const SQL_UNION_ALL   = 'UNION ALL';
const SQL_UNION       = 'UNION';
const SQL_HAVING      = 'HAVING';
const SQL_LOCK_SHARE  = 'FOR SHARE';
const SQL_LOCK_UPDATE = 'FOR UPDATE';

class BaseDialect extends BaseObject {
    /**
     * Base SQL Dialect
     *
     * @param {String} options.prefix
     */
    constructor({ prefix }) {
        super();

        $protected(this).prefix = prefix;
    }

    /**
     * Format an alias
     *
     * @param {String} alias
     *
     * @return {String}
     */
    alias(alias) {
        return `"${alias}"`;
    }

    /**
     * Assign a value
     *
     * @param {Array}  bound
     * @param {String} field
     * @param {String} value
     *
     * @return {String}
     */
    assign(bound, field, value) {
        field = this.field(field);
        value = this.value(bound, value);
        return `${field} = ${value}`;
    }

    /**
     * Apply the DAY function
     *
     * @method dateDay
     *
     * @param {String} field
     *
     * @return {String}
     */
    dateDay(field) {
        return `DAY(${this.field(field)})`;
    }

    /**
     * Apply the MONTH function
     *
     * @method dateMonth
     *
     * @param {String} field
     *
     * @return {String}
     */
    dateMonth(field) {
        return `MONTH(${this.field(field)})`;
    }

    /**
     * Apply the YEAR function
     *
     * @method dateYear
     *
     * @param {String} field
     *
     * @return {String}
     */
    dateYear(field) {
        return `YEAR(${this.field(field)})`;
    }

    /**
     * Decrement a value
     *
     * @param {Array}  bound
     * @param {String} field
     * @param {mixed}  value
     *
     * @return {String}
     */
    decrement(bound, field, value) {
        return this.modifyField(bound, field, '-', value);
    }

    /**
     * Format one field
     *
     * @param {String} field
     * @param {String} alias
     *
     * @return {String}
     */
    field(field, alias = null) {
        if (alias) {
            return `${field} AS ${this.alias(alias)}`;
        }
        return field;
    }

    /**
     * Increment a value
     *
     * @param {Array}  bound
     * @param {String} field
     * @param {mixed}  value
     *
     * @return {String}
     */
    increment(bound, field, value) {
        return this.modifyField(bound, field, '+', value);
    }

    /**
     * Modify a field with some arithmetic
     *
     * @method modifyField
     *
     * @param {Array}  bound
     * @param {String} field
     * @param {String} operator
     * @param {mixed}  value
     *
     * @return {String}
     */
    modifyField(bound, field, operator, value) {
        field    = this.field(field);
        value    = this.value(bound, value);
        operator = this.operator(operator);
        return `${field} = ${field} ${operator} ${value}`;
    }

    /**
     * Set an operator
     *
     * @param {String} operator
     *
     * @return {String}
     */
    operator(operator) {
        return operator;
    }

    /**
     * Format a table-name
     *
     * @param {String} table
     * @param {String} alias
     *
     * @return {String}
     */
    table(table, alias = null) {
        table = `${$protected(this).prefix}${table}`;
        return this.field(table, alias);
    }

    /**
     * Format a value
     *
     * @param {Array}  bound
     * @param {String} value
     *
     * @return {String}
     */
    value(bound, value) {
        return `$${bound.push(value)}`;
    }

    /**
     * Create the SQL WHERE clause of a SQL Query
     *
     * @param {Array}    bound
     * @param {Object[]} whereObjects
     *
     * @return {String}
     */
    where(bound, whereObjects) {
        return whereObjects.map((whereObject, index) => {
            const { joiner } = whereObject;
            const signature  = (whereObject.query)
                ? this.call(whereQuery, bound, whereObject)
                : this.call(fillSignature, bound, whereObject);

            return (0 < index)
                ? `${joiner} ${signature}`
                : signature;
        }).join(' ');
    }

    /**
     * Create the SQL SELECT [DISTINCT] <fields>
     *
     * @param {Array}    bound
     * @param {String}   parts.columns
     * @param {Boolean}  parts.distinct
     * @param {String[]} parts.group
     * @param {Object[]} parts.join
     * @param {Integer}  parts.limit
     * @param {Integer}  parts.offset
     * @param {String}   parts.order
     * @param {String}   parts.table
     * @param {String}   parts.tableAlias
     * @param {String}   parts.tableRaw
     * @param {Object[]} parts.where
     *
     * @return {String}
     */
    sqlSelect(bound, {
        columns,
        distinct,
        group,
        having,
        join,
        limit,
        lock,
        offset,
        order,
        table,
        tableAlias,
        tableName,
        union,
        where,
    }) {
        const query = [];

        this.call(applySelect, query, bound, {
            columns,
            distinct,
            table,
        });
        this.call(applyJoin, query, bound, join, tableAlias || tableName);
        this.call(applyWhere, query, bound, where);
        this.call(applyGroup, query, bound, group, having);
        this.call(applyOrder, query, bound, order);
        this.call(applyLimit, query, bound, limit);
        this.call(applyOffset, query, bound, offset);
        this.call(applyUnion, query, bound, union);
        this.call(applyLock, query, bound, lock);

        return query.join(' ');
    }

    /**
     * Create a SQL INSERT
     *
     * @param {String[]}        fields
     * @param {Array<String[]>} tuples
     * @param {String}          options.table
     *
     * @return {String}
     */
    sqlInsert(fields, tuples, { table }) {
        const toTuple = (values) => `(${values.join(', ')})`;
        fields = toTuple(fields);
        tuples = tuples.map(toTuple).join(', ');
        const signature = `${fields} ${SQL_VALUES} ${tuples}`;
        return this.sqlInsertRaw(signature, { table });
    }

    /**
     * Create the raw SQL INSERT
     *
     * @param {String} signature
     * @param {String} options.table
     *
     * @return {String}
     */
    sqlInsertRaw(signature, { table }) {
        return `${SQL_INSERT} ${table} ${signature}`;
    }

    /**
     * Create a SQL UPDATE
     *
     * @param {Array}    bound
     * @param {Object}   valueMap
     * @param {String}   options.table
     * @param {Object[]} options.where
     *
     * @return {String}
     */
    sqlUpdate(bound, valueMap, { table, where }) {
        const fields    = [];

        RegentMap.create(valueMap).forEach((value, field) => {
            field = this.field(field);
            value = this.value(bound, value);
            fields.push(`${field} = ${value}`);
        });

        const signature = `${fields.join(', ')}`;

        return this.sqlUpdateRaw(bound, signature, {
            table,
            where,
        });
    }

    /**
     * Create the raw SQL UPDATE
     *
     * @param {Array}    bound
     * @param {String}   signature
     * @param {String}   options.table
     * @param {Object[]} options.where
     *
     * @return {String}
     */
    sqlUpdateRaw(bound, signature, { table, where }) {
        const query = [ SQL_UPDATE, table ];
        if (signature && signature.length) {
            query.push(SQL_SET, signature);
        }

        this.call(applyWhere, query, bound, where);

        return query.join(' ');
    }

    /**
     * Create the SQL DELETE statement
     *
     * @method sqlDelete
     *
     * @param {Array}    bound
     * @param {String}   options.table
     * @param {Object[]} options.where
     *
     * @return {String}
     */
    sqlDelete(bound, { table, where }) {
        const query = [
            SQL_DELETE,
            SQL_FROM,
            table,
        ];

        this.call(applyWhere, query, bound, where);

        return query.join(' ');
    }

    /**
     * Create the SQL TRUNCATE statement
     *
     * @method sqlTruncate
     *
     * @param {String}  options.tableName
     * @param {Boolean} options.cascade
     *
     * @return {String}
     */
    sqlTruncate({ tableName }, { cascade = false } = {}) {
        const query = [ SQL_TRUNCATE, tableName ];

        if (cascade) {
            query.push(SQL_CASCADE);
        }

        return query.join(' ');
    }
}

/**
 * Apply the base SQL SELECT behavior
 *
 * @private
 * @method applySelect
 *
 * @param {String[]} queryArray
 * @param {Mixed[]}  boundArray
 * @param {String[]} options.columns
 * @param {Boolean}  options.distinct
 * @param {String}   options.table
 *
 * @return {this}
 */
function applySelect(queryArray, boundArray, { columns, distinct, table }) {
    queryArray.push(SQL_SELECT);

    if (distinct) {
        queryArray.push(SQL_DISTINCT);
    }

    columns = (Array.isArray(columns) && columns.length)
        ? columns.join(', ')
        : '*';

    table = this.table(table);

    queryArray.push(
        columns,
        SQL_FROM,
        table,
    );

    return this;
}

/**
 * Compile the WHERE ... clause into the queryArray
 *
 * @private
 * @method applyWhere
 *
 * @param  {Array}     queryArray
 * @param  {Array}     boundArray
 * @param  {Object[]}  whereObjects
 *
 * @return {this}
 */
function applyWhere(queryArray, boundArray, whereObjects) {
    if (whereObjects && whereObjects.length) {
        queryArray.push(SQL_WHERE, this.where(boundArray, whereObjects));
    }
    return this;
}

/**
 * Compile the LIMIT clause into the queryArray
 *
 * @private
 * @method applyLimit
 *
 * @param {Array}   queryArray
 * @param {Array}   boundArray
 * @param {Integer} limitValue
 *
 * @return {this}
 */
function applyLimit(queryArray, boundArray, limitValue) {
    limitValue = Number(limitValue)|0;
    if (0 < limitValue)  {
        queryArray.push(SQL_LIMIT, this.value(boundArray, limitValue));
    }
    return this;
}

/**
 * Compile the OFFSET clause into the queryArray
 *
 * @method applyOffset
 *
 * @param {Array}   queryArray
 * @param {Array}   boundArray
 * @param {Integer} offsetValue
 *
 * @return {this}
 */
function applyOffset(queryArray, boundArray, offsetValue) {
    offsetValue = Number(offsetValue)|0;

    if (0 < offsetValue) {
        queryArray.push(SQL_OFFSET, this.value(boundArray, offsetValue));
    }

    return this;
}

/**
 * Compile the ORDER BY clause into the queryArray
 *
 * @private
 * @method applyOrder
 *
 * @param {String[]} queryArray
 * @param {Mixed[]}  boundArray
 * @param {Object[]} orderArray
 *
 * @return {this}
 */
function applyOrder(queryArray, boundArray, orderArray) {
    if (orderArray.length) {
        queryArray.push(SQL_ORDER, orderArray.map(({ signature, values }) => {
            return this.call(fillSignature, boundArray, {
                signature,
                values,
            });
        }).join(', '));
    }

    return this;
}

/**
 * Compile the GROUP BY clause into the queryArray
 *
 * @private
 * @method applyGroup
 *
 * @param {String[]} queryArray
 * @param {Mixed[]}  boundArray
 * @param {Object[]} groupArray
 * @param {Object[]} havingObjects
 *
 * @return {this}
 */
function applyGroup(queryArray, boundArray, groupArray, havingObjects) {
    if (groupArray.length) {
        queryArray.push(SQL_GROUP, groupArray.map(({ signature }) => {
            return signature;
        }).join(', '));

        this.call(applyHaving, queryArray, boundArray, havingObjects);
    }
    return this;
}

/**
 * Compile the HAVING clause into the queryArray
 *
 * @private
 * @method applyHaving
 *
 * @param {String[]} queryArray
 * @param {Mixed[]}  boundArray
 * @param {Object[]} havingObjects
 *
 * @return {this}
 */
function applyHaving(queryArray, boundArray, havingObjects) {
    if (havingObjects && havingObjects.length) {
        queryArray.push(SQL_HAVING, this.where(boundArray, havingObjects));
    }
    return this;
}

/**
 * Compile the JOIN clauses into the queryArray
 *
 * @private
 * @method applyJoin
 *
 * @param {String[]} queryArray
 * @param {Mixed[]}  boundArray
 * @param {Object[]} joinArray
 * @param {String}   tableName
 *
 * @return {this}
 */
function applyJoin(queryArray, boundArray, joinArray, tableName) {
    if (joinArray.length) {
        const createJoin = ({ signature, values, type }) => {
            signature = `${type} JOIN ${signature}`;
            return this.call(fillSignature, boundArray, {
                signature,
                values,
            });
        };
        queryArray.push(
            joinArray.map(createJoin)
                .join(' ')
                .replace(/{this}/g, tableName)
        );
    }
    return this;
}

/**
 * Apply the SQL UNION clause to the query array
 *
 * @private
 * @method applyUnion
 *
 * @param {String[]} queryArray
 * @param {Mixed[]}  boundArray
 * @param {Object[]} unionArray
 *
 * @return {this}
 */
function applyUnion(queryArray, boundArray, unionArray) {
    if (Array.isArray(unionArray)) {
        const queue = (unionAll, signature) => {
            queryArray.push(
                unionAll ? SQL_UNION_ALL : SQL_UNION,
                signature,
            );
        };
        unionArray.forEach((unionDefinition) => {
            const {
                queryBuilder,
                signature,
                unionAll,
                values,
            } = unionDefinition;
            if (queryBuilder) {
                const results = queryBuilder.compile(boundArray);
                return queue(unionAll, results.query);
            }
            const processedSignature = this.call(fillSignature, boundArray, {
                signature,
                values,
            });
            return queue(unionAll, processedSignature);
        });
    }
    return this;
}

/**
 * Apply the SQL FOR lock clauses to the query array
 *
 * @private
 * @method applyLock
 *
 * @param {String[]} queryArray
 * @param {Mixed[]}  boundArray
 * @param {String}   lock
 *
 * @return {this}
 */
function applyLock(queryArray, boundArray, lock) {
    if (!lock) {
        return this;
    }
    switch (lock) {
    case SQL_LOCK_SHARE:
        queryArray.push(SQL_LOCK_SHARE);
        break;
    case SQL_LOCK_UPDATE:
        queryArray.push(SQL_LOCK_UPDATE);
        break;
    default:
        queryArray.push(lock);
        break;
    }
    return this;
}

/**
 * Compile a QueryBuilder
 *
 * @private
 * @method whereQuery
 *
 * @param {Mixed[]}      bound
 * @param {QueryBuilder} whereObject.query
 *
 * @return {String}
 */
function whereQuery(bound, { query, signature }) {
    return signature.replace(/\{0\}/g, query.compile(bound).query);
}

/**
 * Fill in a signature
 *
 * @private
 * @method fillSignature
 *
 * @param {Mixed[]} bound
 * @param {String}  object.signature
 * @param {String}  object.values
 *
 * @return {String}
 */
function fillSignature(bound, { signature, values }) {
    return signature.replace(/{(\d+)}/g, (match, valueId) => {
        return (Number(valueId) > values.length)
            ? match
            : this.value(bound, values[valueId]);
    });
}

module.exports = BaseDialect;
