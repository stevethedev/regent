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

const sqlJoinMixin     = requireLib('db/relational/mixins/sql-join');
const sqlWhereMixin    = requireLib('db/relational/mixins/sql-where');
const sqlOffsetMixin   = requireLib('db/relational/mixins/sql-offset');

const {
    PART_COLUMNS,
    PART_DISTINCT,
    PART_GROUP,
    PART_LIMIT,
    PART_ORDER,
    PART_RAW_TABLE,
    PART_TABLE,
    PART_TABLE_ALIAS,
} = requireLib('db/relational/parts');

const DEFAULT_SETTINGS = { dialect: BaseDialect };

class QueryBuilder extends BaseQueryBuilder {
    constructor(connection, table = null, settings = {}) {
        super(connection);

        const self = $protected(this);

        /** @protected */
        self.settings = ObjectMerger.create().merge(DEFAULT_SETTINGS, settings);

        /** @protected */
        self.parts = new RegentMap({
            [PART_COLUMNS    ]: [],
            [PART_DISTINCT   ]: false,
            [PART_GROUP      ]: [],
            [PART_LIMIT      ]: null,
            [PART_ORDER      ]: [],
            [PART_RAW_TABLE  ]: table,
            [PART_TABLE      ]: table,
            [PART_TABLE_ALIAS]: null,
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

        return this;
    }

    /**
     * Compile the query into a string
     *
     * @param {Mixed[]} [bound] The variables array to use with bindings
     *
     * @return {String}
     */
    compile(bound = []) {
        const { dialect, parts } = $protected(this);

        const query = dialect.sqlSelect(
            bound,
            parts.toObject(),
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
            self.parts.toObject(),
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
        const { dialect, parts } = $protected(this);
        parts.set(PART_RAW_TABLE, table);
        parts.set(PART_TABLE_ALIAS, dialect.alias(alias));
        table = dialect.table(table, alias);
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
            fields,
            tuples,
            self.parts.toObject(),
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
            signature,
            self.parts.toObject(),
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
        self.parts.get(PART_COLUMNS).push(signature);
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
            updateObject,
            self.parts.toObject(),
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
            signature,
            self.parts.toObject(),
        );
        self.connection.send(query, bound);
    }

    /**
     * Set the LIMIT clause to <count>
     *
     * @method limit
     *
     * @param {Integer} count
     *
     * @return {this}
     */
    limit(count) {
        $protected(this).parts.set(PART_LIMIT, count);
        return this;
    }

    /**
     * Set the LIMIT clause to <count>
     *
     * @method take
     *
     * @param {Integer} [count=1]
     *
     * @return {this}
     */
    take(count = 1) {
        return this.limit(count);
    }

    /**
     * Add <field> to the ORDER BY clause
     *
     * @method orderBy
     *
     * @param  {String}  field
     * @param  {Boolean} ascending
     *
     * @return {this}
     */
    orderBy(field, ascending = true) {
        field = $protected(this).dialect.field(field);
        return this.orderByRaw(`${field} ${ascending ? 'ASC' : 'DESC'}`);
    }

    /**
     * Add <signature> and <values> to the ORDER BY clause
     *
     * @method orderByRaw
     *
     * @param {String}  signature
     * @param {Mixed[]} values
     *
     * @return {this}
     */
    orderByRaw(signature, values) {
        $protected(this).parts.get(PART_ORDER).push({
            signature,
            values,
        });
        return this;
    }

    /**
     * Add <...fields> to the GROUP BY clause
     *
     * @method groupBy
     *
     * @param {...String} fields
     *
     * @return {this}
     */
    groupBy(...fields) {
        const { dialect } = $protected(this);
        fields.forEach((field) => this.groupByRaw(dialect.field(field)));
        return this;
    }

    /**
     * Add <signature> to the GROUP BY clause
     *
     * @method groupByRaw
     *
     * @param {String} signature
     *
     * @return {this}
     */
    groupByRaw(signature) {
        $protected(this).parts.get(PART_GROUP).push({ signature });
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

sqlJoinMixin(QueryBuilder);
sqlWhereMixin(QueryBuilder);
sqlOffsetMixin(QueryBuilder);

module.exports = QueryBuilder;
