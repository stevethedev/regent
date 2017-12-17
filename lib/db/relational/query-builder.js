/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseDialect      = requireLib('db/relational/dialect/base');
const BaseQueryBuilder = requireLib('db/query-builder');
const ObjectMerger     = requireLib('util/object-merger');
const RegentMap        = requireLib('support/map');
const RegentSet        = requireLib('support/set');
const { $protected }   = requireLib('util/scope')();

const DEFAULT_SETTINGS = { dialect: BaseDialect };

const PART_TABLE    = 'table';
const PART_DISTINCT = 'distinct';
const PART_COLUMNS  = 'columns';
const PART_WHERE    = 'where';

class QueryBuilder extends BaseQueryBuilder {
    constructor(connection, table = null, settings = {}) {
        super(connection);

        const self = $protected(this);

        /** @protected */
        self.settings = ObjectMerger.create().merge(DEFAULT_SETTINGS, settings);

        /** @protected */
        self.parts = new RegentMap({
            [PART_COLUMNS ]: [],
            [PART_DISTINCT]: false,
            [PART_TABLE   ]: table,
            [PART_WHERE   ]: [],
        });
        self.parts.set(PART_TABLE, table);

        this.reset();
    }

    /**
     * Reset the query to its default state
     *
     * @param {String} [part=null]
     *
     * @return {this}
     */
    reset(part = null) {
        const self         = $protected(this);

        self.dialect = self.settings.dialect.create();

        this.call(setDistinctPart, part);
        this.call(setColumnPart, part);
        this.call(setWherePart, part);

        return this;
    }

    /**
     * Compile the query into a string
     *
     * @return {String}
     */
    compile() {
        const self    = $protected(this);
        const bound   = [];

        const query = self.dialect.sqlSelect(
            bound,
            self.parts.get(PART_DISTINCT),
            self.parts.get(PART_COLUMNS),
            self.parts.get(PART_TABLE),
            self.parts.get(PART_WHERE),
        );

        return {
            bound,
            query,
        };
    }

    /**
     * Add "AVG(<field>) [AS <alias>]" to the SELECT clause
     *
     * @param {String}  field
     * @param {String=} alias
     *
     * @return {this}
     */
    avg(field, alias = null) {
        return this.call(aggregate, 'AVG', field, alias);
    }

    /**
     * Add "COUNT(<field>) [AS <alias>]" to the SELECT clause
     *
     * @param {String}  field
     * @param {String=} alias
     *
     * @return {this}
     */
    count(field, alias = null) {
        return this.call(aggregate, 'COUNT', field, alias);
    }

    /**
     * Decrement a field and send the request
     *
     * @param {String|Object} field
     * @param {Number|Object} [value]
     * @param {Object}        [values]
     *
     * @return {this}
     */
    decrement(field, value = 1, values = {}) {
        if ('object' !== typeof field) {
            return this.decrement({ [field]: value }, values);
        }

        if (1 === value) {
            value = {};
        }

        const { dialect }  = $protected(this);
        const decrementMap = RegentMap.create(field);
        const valueMap     = RegentMap.create(value);
        const fields       = [];
        const bound        = [];

        decrementMap.forEach((mapValue, mapField) => {
            if (!valueMap.has(mapField)) {
                fields.push(dialect.decrement(bound, mapField, mapValue));
            }
        });

        valueMap.forEach((mapValue, mapField) => {
            fields.push(dialect.assign(bound, mapField, mapValue));
        });

        return this.updateRaw(fields.join(', '), bound);
    }

    /**
     * Create and send SQL DELETE command
     *
     * @return {mixed}
     */
    delete() {
        const self = $protected(this);
        const bound = [];
        const signature = self.dialect.sqlDelete(
            bound,
            self.parts.get(PART_TABLE),
            self.parts.get(PART_WHERE)
        );
        return self.connection.send(signature, bound);
    }

    /**
     * Enable or disable the DISTINCT keyword on the SELECT clause
     *
     * @param {Boolean} enable
     *
     * @return {this}
     */
    distinct(enable = true) {
        const self = $protected(this);
        self.parts.set(PART_DISTINCT, enable);
        return this;
    }

    /**
     * Set the FROM clause to "<table> [AS <alias>]"
     *
     * @param {String}  table
     * @param {String=} alias
     *
     * @return {this}
     */
    from(table, alias = null) {
        const self = $protected(this);
        table = self.dialect.table(table, alias);
        return this.fromRaw(table);
    }

    /**
     * Set the FROM clause to <signature>
     *
     * @param {String} signature
     *
     * @return {this}
     */
    fromRaw(signature) {
        const self = $protected(this);
        self.parts.set(PART_TABLE, signature);
        return this;
    }

    /**
     * Create and send an INSERT INTO request with value objects
     *
     * @param {...Object} valueObject
     *
     * @return {mixed}
     */
    insert(...valueObject) {
        const self        = $protected(this);
        const { dialect } = self;
        const bound       = [];
        const fields      = new RegentSet();
        const tuples      = [];

        this.call(normalizeInserts, valueObject, fields, tuples, bound);

        const query = dialect.sqlInsert(
            self.parts.get(PART_TABLE),
            fields,
            tuples
        );

        return self.connection.send(query, bound);
    }

    /**
     * Increment a field and send the request
     *
     * @param {String|Object} field
     * @param {Number|Object} [value]
     * @param {Object}        [values]
     *
     * @return {Mixed}
     */
    increment(field, value = 1, values = {}) {
        if ('object' !== typeof field) {
            return this.increment({ [field]: value }, values);
        }

        if (1 === value) {
            value = {};
        }

        const self         = $protected(this);
        const { dialect }  = self;
        const incrementMap = RegentMap.create(field);
        const valueMap     = RegentMap.create(value);
        const fields       = [];
        const bound        = [];

        incrementMap.forEach((mapValue, mapField) => {
            if (!valueMap.has(mapField)) {
                fields.push(dialect.increment(bound, mapField, mapValue));
            }
        });

        valueMap.forEach((mapValue, mapField) => {
            fields.push(dialect.assign(bound, mapField, mapValue));
        });

        return this.updateRaw(fields.join(', '), bound);
    }

    /**
     * Create and send an INSERT INTO request
     *
     * @param {String} signature
     * @param {Array}  bound
     *
     * @return {mixed}
     */
    insertRaw(signature, bound) {
        const self  = $protected(this);
        const query = self.dialect.sqlInsertRaw(
            self.parts.get(PART_TABLE),
            signature
        );
        return self.connection.send(query, bound);
    }

    /**
     * Alias for this.from
     *
     * @param {String} field
     * @param {String} [alias=]
     *
     * @return {this}
     */
    into(field, alias) {
        return this.from(field, alias);
    }

    /**
     * Alias for this.fromRaw
     *
     * @param {String} signature
     *
     * @return {this}
     */
    intoRaw(signature) {
        return this.fromRaw(signature);
    }

    /**
     * Add "MAX(<field>) [AS <alias>]" to the SELECT clause
     *
     * @param {String}  field
     * @param {String=} alias
     *
     * @return {this}
     */
    max(field, alias = null) {
        return this.call(aggregate, 'MAX', field, alias);
    }

    /**
     * Add "MIN(<field>) [AS <alias>]" to the SELECT clause
     *
     * @param {String}  field
     * @param {String=} alias
     *
     * @return {this}
     */
    min(field, alias = null) {
        return this.call(aggregate, 'MIN', field, alias);
    }

    /**
     * Add "<field> [AS <alias>]" to the SELECT clause
     *
     * @param {String|Object} ...fields
     *
     * @return {this}
     */
    select(...fields) {
        const { dialect } = $protected(this);

        const signature = [];

        fields.forEach((field) => {
            const copyAlias = (alias) => {
                const fieldName = dialect.field(field[alias], alias);
                signature.push(fieldName);
            };

            if (field && 'object' === typeof field) {
                return Object.keys(field).forEach(copyAlias);
            }

            field = dialect.field(field);
            return signature.push(field);
        });
        return this.selectRaw(signature.join(', '));
    }

    /**
     * Add <signature> to the SELECT clause
     *
     * @param {String} signature
     *
     * @return {this}
     */
    selectRaw(signature) {
        const self = $protected(this);
        self.parts.set('columns', signature);
        return this;
    }

    /**
     * Add "SUM(<field>) [AS <alias>]" to the SELECT clause
     *
     * @param {String}  field
     * @param {String=} alias
     *
     * @return {this}
     */
    sum(field, alias = null) {
        return this.call(aggregate, 'SUM', field, alias);
    }

    /**
     * Create and send a SQL UPDATE <table> SET command
     *
     * @param {Object} updateObject
     *
     * @return {mixed}
     */
    update(updateObject) {
        const self        = $protected(this);
        const { dialect } = self;
        const bound       = [];

        const query = dialect.sqlUpdate(
            bound,
            self.parts.get(PART_TABLE),
            updateObject,
            self.parts.get(PART_WHERE)
        );

        return self.connection.send(query, bound);
    }

    /**
     * Create and send a SQL UPDATE <table> SET command
     *
     * @param {String} signature
     * @param {Array}  values
     *
     * @return {mixed}
     */
    updateRaw(signature, values = []) {
        const self = $protected(this);
        const bound = [...values];
        const query = self.dialect.sqlUpdateRaw(
            bound,
            self.parts.get(PART_TABLE),
            signature,
            self.parts.get(PART_WHERE)
        );
        self.connection.send(query, bound);
    }

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
        const { operator, right } = this.call(getOperatorArray, args);
        field = $protected(this).dialect.field(field);
        return this.whereRaw(`${field} ${operator} {0}`, [right]);
    }

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
    }

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
    }

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
    }

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
    }

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
            'AND',
            (date) => date.getDate(),
            'dateDay',
            field,
            args,
        );
    }

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
            'AND',
            (date) => 1 + date.getMonth(),
            'dateMonth',
            field,
            args,
        );
    }

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
            'AND',
            (date) => date.getFullYear(),
            'dateYear',
            field,
            args,
        );
    }

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
    }

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
    }

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
    }

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
        const { operator, right } = this.call(getOperatorArray, args);
        field = $protected(this).dialect.field(field);
        return this.orWhereRaw(`${field} ${operator} {0}`, [right]);
    }

    /**
     * Add a conditional to the SQL WHERE clause with an OR joiner
     *
     * @param {String} signature
     * @param {Array}  values
     *
     * @return {this}
     */
    orWhereRaw(signature, values = []) {
        const self = $protected(this);
        const joiner = 'OR';
        self.parts.get(PART_WHERE).push({
            joiner,
            signature,
            values,
        });
        return this;
    }
}

/**
 * Create aggregate function signature for the SELECT statement
 *
 * @private
 * @method aggregate
 *
 * @param  {String}  fn
 * @param  {String}  field
 * @param  {String=} alias
 *
 * @return {this}
 */
function aggregate(fn, field, alias) {
    field = `${fn}(${field})`;
    if (alias) {
        return this.select({ [alias]: field });
    }
    return this.select(field);
}

/**
 * @private
 * @method setDistinctPart
 *
 * @param {String} part
 *
 * @return {this}
 */
function setDistinctPart(part) {
    if (!part || PART_DISTINCT === part) {
        $protected(this).parts.set(PART_DISTINCT, false);
    }
    return this;
}

/**
 * @private
 * @method setColumnPart
 *
 * @param {String} part
 *
 * @return {this}
 */
function setColumnPart(part) {
    if (!part || PART_COLUMNS === part) {
        $protected(this).parts.get(PART_COLUMNS).length = 0;
    }
    return this;
}

/**
 * @private
 * @method setWherePart
 *
 * @param {String} part
 *
 * @return {this}
 */
function setWherePart(part) {
    if (!part || PART_WHERE === part) {
        $protected(this).parts.get(PART_WHERE).length = 0;
    }
    return this;
}

/**
 * @private
 *
 * @method getOperatorArray
 *
 * @param {mixed[]} argsArray
 *
 * @return {Object}
 */
function getOperatorArray(argsArray) {
    if (1 === argsArray.length) {
        argsArray.unshift('=');
    }

    const { dialect } = $protected(this);
    const operator    = dialect.operator(argsArray[0]);
    const [ , right ] = argsArray;

    return {
        operator,
        right,
    };
}

/**
 * Normalize SQL INSERT fields
 *
 * @private
 * @method normalizeInserts
 *
 * @param {Object[]} valueObject
 * @param {String[]} fields
 * @param {Mixed[]}  tuples
 * @param {Mixed[]}  bound
 *
 * @return {this}
 */
function normalizeInserts(valueObject, fields, tuples, bound) {
    const { dialect } = $protected(this);
    const values = valueObject.map((mapValueObject) => {
        return new RegentMap(mapValueObject);
    });

    // Build a registry of all field names
    values.forEach((valueMap) => {
        valueMap.forEach((value, field) => {
            fields.add(field);
        });
    });

    // Use the field names to normalize the fields
    values.forEach((valueMap) => {
        const tuple = fields.map((field) => {
            const value = valueMap.get(field, null);
            return dialect.value(bound, value);
        });
        tuples.push(tuple);
    });

    return this;
}

/**
 * Add <field> IN (<...values>) to the SQL WHERE clause
 *
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
 * @method whereDateGeneric
 *
 * @param {String}  join      - AND/OR
 * @param {String}  dateFn    - Function to run on the date object
 * @param {String}  dialectFn - Function to run on the dialect
 * @param {String}  field     - Field name
 * @param {mixed[]} args      - arguments
 *
 * @return {this}
 */
function whereDateGeneric(join, dateFn, dialectFn, field, args) {
    const { operator, right } = this.call(getOperatorArray, args);
    const { dialect } = $protected(this);
    const value = (right instanceof Date)
        ? dateFn(right)
        : right;
    return this.whereRaw(
        `${dialect[dialectFn](field)} ${operator} {0}`,
        [value],
        join
    );
}

module.exports = QueryBuilder;
