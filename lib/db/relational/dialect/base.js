/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject = requireLib('util/base-object');
const RegentMap  = requireLib('support/map');

const SQL_SELECT   = 'SELECT';
const SQL_DISTINCT = 'DISTINCT';
const SQL_FROM     = 'FROM';
const SQL_WHERE    = 'WHERE';
const SQL_UPDATE   = 'UPDATE';
const SQL_SET      = 'SET';

class BaseDialect extends BaseObject
{
    constructor()
    {
        super();
    }

    /**
     * Format an alias
     *
     * @param {String} name
     * @param {String} alias
     *
     * @return {String}
     */
    alias(name, alias)
    {
        return `${name} AS "${alias}"`;
    }

    /**
     * Assign a value
     *
     * @param {Array}  bound
     * @param {String} field
     * @param {String} value
     */
    assign(bound, field, value)
    {
        field = this.field(field);
        value = this.value(bound, value);
        return `${field} = ${value}`;
    }

    /**
     * Apply a condition to a field
     *
     * @param {Array}  bound
     * @param {String} field
     * @param {String} operator
     * @param {String} [value=]
     *
     * @return {String}
     */
    condition(bound, field, operator, value)
    {
        field    = this.field(field);
        operator = this.operator(operator);

        const condition = `${field} ${operator}`;
        if (4 > arguments.length) {
            return condition;
        }

        value = this.value(bound, value);
        return `${condition} ${value}`;
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
    decrement(bound, field, value)
    {
        field = this.field(field);
        value = this.value(bound, value);
        return `${field} = ${field} - ${value}`;
    }

    /**
     * Format one field
     *
     * @param {String} field
     * @param {String} alias
     *
     * @return {String}
     */
    field(field, alias = null)
    {
        if (alias) {
            return this.alias(field, alias);
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
    increment(bound, field, value)
    {
        field = this.field(field);
        value = this.value(bound, value);
        return `${field} = ${field} + ${value}`;
    }

    /**
     * Set an operator
     *
     * @param {String} operator
     *
     * @return {String}
     */
    operator(operator)
    {
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
    table(table, alias = null)
    {
        if (alias) {
            return this.alias(table, alias);
        }
        return table;
    }

    /**
     * Format a value
     *
     * @param {String} value
     * @param {Array}  bound
     *
     * @return {String}
     */
    value(bound, value)
    {
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
    where(bound, whereObjects, joiner = 'AND')
    {
        if (!whereObjects || !whereObjects.length) {
            return '';
        }

        return whereObjects.map((whereObject) => {
            bound.push(...whereObject.values);
            return whereObject.signature;
        }).join(` ${joiner} `);
    }

    /**
     * Create the SQL SELECT [DISTINCT] <fields>
     *
     * @param {Array}    bound
     * @param {Bool}     useDistinct
     * @param {String}   fields
     * @param {String}   fromTable
     * @param {Object[]} whereObjects
     *
     * @return {String}
     */
    sqlSelect(bound, useDistinct, fields, tableName, whereObjects)
    {
        if (!fields.length) {
            fields = '*';
        }
        if (Array.isArray(fields)) {
            fields = fields.join(', ');
        }

        const query = [SQL_SELECT];

        if (useDistinct) {
            query.push(SQL_DISTINCT);
        }

        query.push(
            fields,
            SQL_FROM,
            tableName
        );

        this.call(applyWhere, query, bound, whereObjects);

        return query.join(' ');
    }

    /**
     * Create a SQL INSERT
     *
     * @param {String}     table
     * @param {String[]}   fields
     * @param {String[][]} tuples
     *
     * @return {String}
     */
    sqlInsert(table, fields, tuples)
    {
        const toTuple = (v) => `(${v.join(', ')})`;
        fields = toTuple(fields);
        tuples = tuples.map(toTuple).join(', ');
        const signature = `${fields} VALUES ${tuples}`;
        return this.sqlInsertRaw(table, signature);
    }

    /**
     * Create the raw SQL INSERT
     * 
     * @param {String} table
     * @param {String} signature
     *
     * @return {String}
     */
    sqlInsertRaw(table, signature)
    {
        return `INSERT INTO ${table} ${signature}`;
    }

    /**
     * Create a SQL UPDATE
     *
     * @param {Array}  bound
     * @param {String} table
     * @param {Object} valueMap
     */
    sqlUpdate(bound, table, valueMap, whereObjects)
    {
        const fields    = [];

        RegentMap.create(valueMap).forEach((value, field) => {
            field = this.field(field);
            value = this.value(bound, value);
            fields.push(`${field} = ${value}`);
        });

        const signature = `${fields.join(', ')}`;

        return this.sqlUpdateRaw(bound, table, signature, whereObjects);
    }

    /**
     * Create the raw SQL UPDATE
     *
     * @param {String} table
     * @param {String} signature
     *
     * @return {String}
     */
    sqlUpdateRaw(bound, table, signature, whereObjects)
    {
        const query = [SQL_UPDATE, table];
        if (signature && signature.length) {
            query.push(SQL_SET, signature);
        }

        this.call(applyWhere, query, bound, whereObjects);

        return query.join(' ');
    }
}

/**
 * Compile the WHERE ... clause into the queryArray
 *
 * @private
 * @method applyWhere
 *
 * @param  {Array}     queryArray
 * @param  {Object[]}  whereObjects
 * @param  {Array}     boundArray
 */
function applyWhere(queryArray, boundArray, whereObjects)
{
    if (whereObjects && whereObjects.length) {
        queryArray.push(SQL_WHERE, this.where(boundArray, whereObjects));
    }
}

module.exports = BaseDialect;
