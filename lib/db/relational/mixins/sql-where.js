/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const RegentSet            = requireLib('support/set');
const { $protected }       = requireLib('util/scope')();
const { getOperatorArray } = requireLib('db/relational/utils');
const { PART_WHERE }       = requireLib('db/relational/parts');

const Mixin = {
    /**
     * Add a conditional to the SQL WHERE clause
     *
     * @param {String} field
     * @param {mixed}  [operator=]
     * @param {mixed}  value
     *
     * @return {this}
     */
    orWhere(field, ...args) {
        return this.call(
            commonWhere,
            {
                args,
                field,
                joiner: 'OR',
            }
        );
    },

    /**
     * Add a conditional to the SQL WHERE clause with an OR joiner
     *
     * @param {String} signature
     * @param {Array}  values
     *
     * @return {this}
     */
    orWhereRaw(signature, values = []) {
        const joiner = 'OR';
        $protected(this).parts.get(PART_WHERE).push({
            joiner,
            signature,
            values,
        });
        return this;
    },

    /**
     * Add conditional to the SQL WHERE clause
     *
     * @param {String} field
     * @param {mixed}  [operator=]
     * @param {mixed}  value
     *
     * @return {this}
     */
    where(field, ...args) {
        return this.call(
            commonWhere,
            {
                args,
                field,
                joiner: 'AND',
            }
        );
    },

    /**
     * Add a boundary filter around a field filter.
     *
     * @method whereBetween
     *
     * @param {String}  field
     * @param {mixed[]} range
     * @param {Boolean} [inclusive=true]
     *
     * @return {this}
     */
    whereBetween(field, range, inclusive = true) {
        const [ min, max ] = range;
        return this
            .where(field, inclusive ? '>=' : '>', min)
            .where(field, inclusive ? '<=' : '<', max);
    },

    /**
     * Add a field-to-field comparison filter.
     *
     * @method whereColumn
     *
     * @param {String} leftField
     * @param {String} [operator='=']
     * @param {String} rightField
     *
     * @return {this}
     */
    whereColumn(leftField, ...args) {
        const { operator, right } = this.call(getOperatorArray, args);
        const { dialect } = $protected(this);
        const rightField  = dialect.field(right);

        return this.whereRaw(`${leftField} ${operator} ${rightField}`, []);
    },

    /**
     * Add a date filter
     *
     * @method whereDate
     *
     * @param {String} field
     * @param {String} [operator='=']
     * @param {mixed}  date
     *
     * @return {this}
     */
    whereDate(field, ...args) {
        const { operator, right } = this.call(getOperatorArray, args);
        return this.where(field, operator, right);
    },

    /**
     * Add a day-of-month filter.
     *
     * @method whereDay
     *
     * @param {String} field
     * @param {String} [operator='=']
     * @param {mixed}  date
     *
     * @return {this}
     */
    whereDay(field, ...args) {
        return this.call(
            whereDateGeneric,
            {
                args,
                dateFn   : (date) => date.getDate(),
                dialectFn: 'dateDay',
                field,
                joiner   : 'AND',
            },
        );
    },

    /**
     * Compile a query and use the result in the query value
     *
     * @method whereExists
     *
     * @param {QueryBuilder} query
     * @param {String}       [joiner]
     *
     * @return {this}
     */
    whereExists(query, joiner = 'AND') {
        $protected(this).parts.get(PART_WHERE).push({
            joiner,
            query,
            signature: 'EXISTS ({0})',
        });
        return this;
    },

    /**
     * Add EXISTS (<signature>) to the SQL WHERE clause
     *
     * @method whereExistsRaw
     *
     * @param {String}  signature [description
     * @param {mixed[]} values    [description
     *
     * @return {this}
     */
    whereExistsRaw(signature, values) {
        return this.whereRaw(
            `EXISTS (${signature})`,
            values
        );
    },

    /**
     * Add <field> IN (<...values>) to the SQL WHERE clause
     *
     * @method whereIn
     *
     * @param {String}  field
     * @param {mixed[]} values
     *
     * @return {this}
     */
    whereIn(field, values) {
        return this.call(whereInOperator, field, values, { include: true });
    },

    /**
     * Add a month-of-year filter.
     *
     * @method whereMonth
     *
     * @param {String} field
     * @param {String} [operator='=']
     * @param {mixed}  month
     *
     * @return {this}
     */
    whereMonth(field, ...args) {
        return this.call(
            whereDateGeneric,
            {
                args,
                dateFn   : (date) => 1 + date.getMonth(),
                dialectFn: 'dateMonth',
                field,
                joiner   : 'AND',
            },
        );
    },

    /**
     * Add a boundary filter around a field filter.
     *
     * @method whereNotBetween
     *
     * @param {String}  field
     * @param {mixed[]} range
     * @param {Boolean} inclusive
     *
     * @return {this}
     */
    whereNotBetween(field, range, inclusive = true) {
        const [ min, max ] = range;
        const left = `${field} ${inclusive ? '<' : '<='} {0}`;
        const right = `${field} ${inclusive ? '>' : '>='} {1}`;

        return this.whereRaw(`(${left} OR ${right})`, [ min, max ]);
    },

    /**
     * Add <field> NOT IN (<...values>) to the SQL WHERE clause
     *
     * @method whereNotIn
     *
     * @param {String}  field
     * @param {mixed[]} values
     *
     * @return {this}
     */
    whereNotIn(field, values) {
        return this.call(whereInOperator, field, values, { include: false });
    },

    /**
     * Add <field> IS NOT NULL to the SQL WHERE clause
     *
     * @method whereNotNull
     *
     * @param {String} field
     *
     * @return {this}
     */
    whereNotNull(field) {
        field = $protected(this).dialect.field(field);
        return this.whereRaw(`${field} IS NOT NULL`);
    },

    /**
     * Add <field> IS NULL to the SQL WHERE clause
     *
     * @method whereNull
     *
     * @param {String} field
     *
     * @return {this}
     */
    whereNull(field) {
        field = $protected(this).dialect.field(field);
        return this.whereRaw(`${field} IS NULL`);
    },

    /**
     * Add a conditional to the SQL WHERE clause
     *
     * @param {String} signature
     * @param {Array}  [values]
     * @param {String} [joiner]
     *
     * @return {this}
     */
    whereRaw(signature, values = [], joiner = 'AND') {
        const where = $protected(this).parts.get(PART_WHERE);
        where.push({
            joiner,
            signature,
            values,
        });
        return this;
    },

    /**
     * Add a year filter.
     *
     * @method whereYear
     *
     * @param {String} field
     * @param {String} [operator='=']
     * @param {mixed}  year
     *
     * @return {this}
     */
    whereYear(field, ...args) {
        return this.call(
            whereDateGeneric,
            {
                args,
                dateFn   : (date) => date.getFullYear(),
                dialectFn: 'dateYear',
                field,
                joiner   : 'AND',
            },
        );
    },
};

/**
 * Add <field> IN (<...values>) to the SQL WHERE clause
 *
 * @private
 * @method whereIn
 *
 * @param {String}  field
 * @param {mixed[]} values
 * @param {Boolean} [include=true] WHERE IN vs WHERE NOT IN
 *
 * @return {this}
 */
function whereInOperator(field, values, { include = true } = {}) {
    const { dialect } = $protected(this);
    const valueArray  = RegentSet.create(values).toArray();
    const indexArray  = valueArray.map((value, index) => `{${index}}`);
    const negate = include ? '' : 'NOT ';

    field = dialect.field(field);

    const signature = valueArray.length
        ? `${field} ${negate}IN (${indexArray.join(', ')})`
        : `${field} IS ${negate}NULL`;

    return this.whereRaw(signature, values);
}

/**
 * Generic date function enabler
 *
 * @private
 * @method whereDateGeneric
 *
 * @param {String}  options.joiner    - AND/OR
 * @param {String}  options.dateFn    - Function to run on the date object
 * @param {String}  options.dialectFn - Function to run on the dialect
 * @param {String}  options.field     - Field name
 * @param {mixed[]} options.args      - arguments
 *
 * @return {this}
 */
function whereDateGeneric({ joiner, dateFn, dialectFn, field, args }) {
    const { operator, right } = this.call(getOperatorArray, args);
    const { dialect } = $protected(this);
    const value = (right instanceof Date)
        ? dateFn(right)
        : right;
    return this.whereRaw(
        `${dialect[dialectFn](field)} ${operator} {0}`,
        [value],
        joiner,
    );
}

/**
 * Common constructor for SQL WHERE behavior
 *
 * @private
 * @method commonWhere
 *
 * @param {String}  options.joiner - AND/OR
 * @param {String}  options.field
 * @param {mixed[]} options.args
 *
 * @return {this}
 */
function commonWhere({ joiner, field, args }) {
    const { operator, right } = this.call(getOperatorArray, args);
    field = $protected(this).dialect.field(field);
    return this.whereRaw(`${field} ${operator} {0}`, [right], joiner);
}

module.exports = function sqlWhereMixin(QueryBuilder) {
    QueryBuilder.mix(Mixin, (mixin, target) => {
        const { reset } = target;
        target.reset = function(part) {
            if (!part || PART_WHERE === part) {
                $protected(this).parts.set(PART_WHERE, []);
            }
            return this.call(reset, part);
        };
    });
};

