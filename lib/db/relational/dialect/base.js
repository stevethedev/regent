/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject = requireLib('util/base-object');

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

    sqlInsert(table, fields, tuples)
    {
        const toTuple = (v) => `(${v.join(', ')})`;
        fields = toTuple(fields);
        tuples = tuples.map(toTuple).join(', ');
        const signature = `${fields} VALUES ${tuples}`;
        return this.sqlInsertRaw(table, signature);
    }

    sqlInsertRaw(table, signature)
    {
        return `INSERT INTO ${table} ${signature}`;
    }
}

module.exports = BaseDialect;
