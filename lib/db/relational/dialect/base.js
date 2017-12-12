/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject = requireLib('util/base-object');
const RegentMap  = requireLib('support/map');

const SQL_UPDATE   = 'UPDATE';
const SQL_DELETE   = 'DELETE';
const SQL_INSERT   = 'INSERT INTO';
const SQL_SELECT   = 'SELECT';
const SQL_DISTINCT = 'DISTINCT';
const SQL_FROM     = 'FROM';
const SQL_WHERE    = 'WHERE';
const SQL_SET      = 'SET';
const SQL_VALUES   = 'VALUES';

class BaseDialect extends BaseObject {
    /**
     * Format an alias
     *
     * @param {String} name
     * @param {String} alias
     *
     * @return {String}
     */
    alias(name, alias) {
        return `${name} AS "${alias}"`;
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
     * Apply a condition to a field
     *
     * @param {Array}  bound
     * @param {String} field
     * @param {String} operator
     * @param {String} [value=]
     *
     * @return {String}
     */
    condition(bound, field, operator, value) {
        field    = this.field(field);
        operator = this.operator(operator);

        const condition = `${field} ${operator}`;
        if (this.condition.length > arguments.length) {
            return condition;
        }

        value = this.value(bound, value);
        return `${condition} ${value}`;
    }

    /**
     * Format a date value, if necessary
     *
     * @method date
     *
     * @param  {mixed} date
     *
     * @return {mixed} date
     */
    date(date) {
        return date;
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
        if (alias) {
            return this.alias(table, alias);
        }
        return table;
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
        if (!whereObjects || !whereObjects.length) {
            return '';
        }

        return whereObjects.map((whereObject, index) => {
            let condition = (0 < index)
                ? `${whereObject.joiner || 'AND'} `
                : '';
            if (whereObject.signature) {
                bound.push(...whereObject.values);
                condition += whereObject.signature;
            } else {
                condition += this.condition(
                    bound,
                    whereObject.field,
                    whereObject.operator,
                    whereObject.value
                );
            }
            return condition;
        }).join(' ');
    }

    /**
     * Create the SQL WHERE ... IN ...
     *
     * @method whereIn
     *
     * @param {mixed[]} bound
     * @param {String}  field
     * @param {mixed[]} valueArray
     * @param {Boolean} include    - Whether to use "IN" vs "NOT IN"
     *
     * @return {String}
     */
    whereIn(bound, field, valueArray, include) {
        field = this.field(field);
        valueArray = valueArray.map((value) => this.value(bound, value));
        const negate = include ? '' : 'NOT ';
        return valueArray.length
            ? `${field} ${negate}IN (${valueArray.join(', ')})`
            : `${field} IS ${negate}NULL`;
    }

    /**
     * Create the SQL SELECT [DISTINCT] <fields>
     *
     * @param {Array}    bound
     * @param {Bool}     useDistinct
     * @param {String}   fields
     * @param {String}   tableName
     * @param {Object[]} whereObjects
     *
     * @return {String}
     */
    sqlSelect(bound, useDistinct, fields, tableName, whereObjects) {
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
     * @param {String}          table
     * @param {String[]}        fields
     * @param {Array<String[]>} tuples
     *
     * @return {String}
     */
    sqlInsert(table, fields, tuples) {
        const toTuple = (values) => `(${values.join(', ')})`;
        fields = toTuple(fields);
        tuples = tuples.map(toTuple).join(', ');
        const signature = `${fields} ${SQL_VALUES} ${tuples}`;
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
    sqlInsertRaw(table, signature) {
        return `${SQL_INSERT} ${table} ${signature}`;
    }

    /**
     * Create a SQL UPDATE
     *
     * @param {Array}    bound
     * @param {String}   table
     * @param {Object}   valueMap
     * @param {Object[]} whereObjects
     *
     * @return {String}
     */
    sqlUpdate(bound, table, valueMap, whereObjects) {
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
     * @param {Array}    bound
     * @param {String}   table
     * @param {String}   signature
     * @param {Object[]} whereObjects
     *
     * @return {String}
     */
    sqlUpdateRaw(bound, table, signature, whereObjects) {
        const query = [ SQL_UPDATE, table ];
        if (signature && signature.length) {
            query.push(SQL_SET, signature);
        }

        this.call(applyWhere, query, bound, whereObjects);

        return query.join(' ');
    }

    /**
     * Create the SQL DELETE statement
     *
     * @param {Array}    bound
     * @param {String}   table
     * @param {Object[]} whereObjects
     *
     * @return {String}
     */
    sqlDelete(bound, table, whereObjects) {
        const query = [
            SQL_DELETE,
            SQL_FROM,
            table,
        ];

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

module.exports = BaseDialect;
