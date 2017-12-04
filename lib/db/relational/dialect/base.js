/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject = requireLib('util/base-object');
const RegentMap  = requireLib('support/map');

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
     * @param {String} field
     * @param {String} value
     */
    assign(field, value, binding)
    {
        field = this.field(field);
        value = this.value(value, binding);
        return `${field} = ${value}`;
    }

    /**
     * Decrement a value
     *
     * @param {String} field
     * @param {mixed}  value
     * @param {Array}  binding
     *
     * @return {String}
     */
    decrement(field, value, binding)
    {
        field = this.field(field);
        value = this.value(value, binding);
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
     * @param {String} field
     * @param {mixed}  value
     * @param {Array}  binding
     *
     * @return {String}
     */
    increment(field, value, binding)
    {
        field = this.field(field);
        value = this.value(value, binding);
        return `${field} = ${field} + ${value}`;
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
     * @param {Array}  binding
     *
     * @return {String}
     */
    value(value, binding)
    {
        return `$${binding.push(value)}`;
    }

    /**
     * Create the SQL SELECT [DISTINCT] <fields>
     * 
     * @param {Bool}     useDistinct
     * @param {String} fields
     * @param {String}   fromTable
     *
     * @return {String}
     */
    sqlSelect(useDistinct, fields, tableName)
    {
        if (!fields.length) {
            fields = '*';
        }
        if (Array.isArray(fields)) {
            fields = fields.join(', ');
        }

        const SQL_SELECT   = 'SELECT';
        const SQL_DISTINCT = 'DISTINCT';
        const SQL_FROM     = 'FROM';

        const query = [SQL_SELECT];

        if (useDistinct) {
            query.push(SQL_DISTINCT);
        }

        query.push(
            fields,
            SQL_FROM,
            tableName
        );

        return query.join(' ');
    }

    /**
     * Create the SQL FROM <table>
     *
     * @param {String} table
     *
     * @return {String}
     */
    sqlFrom(table)
    {
        return table
            ? `FROM ${table}`
            : '';
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
     * @param {Array}  binding
     * @param {String} table
     * @param {Object} valueMap
     */
    sqlUpdate(binding, table, valueMap)
    {
        const fields    = [];

        RegentMap.create(valueMap).forEach((value, field) => {
            field = this.field(field);
            value = this.value(value, binding);
            fields.push(`${field} = ${value}`);
        });

        const signature = `${fields.join(', ')}`;

        return this.sqlUpdateRaw(table, signature);
    }

    /**
     * Create the raw SQL UPDATE
     *
     * @param {String} table
     * @param {String} signature
     *
     * @return {String}
     */
    sqlUpdateRaw(table, signature)
    {
        return `UPDATE ${table} SET ${signature}`;
    }
}

module.exports = BaseDialect;
