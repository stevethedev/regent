/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const BaseObject     = requireLib('util/base-object');
const RegentMap      = requireLib('support/map');

const { $protected } = requireLib('util/scope')();

class Record extends BaseObject {
    /**
     * @constructor
     *
     * @param {Connection} options.connection
     * @param {String}     options.tableName
     * @param {Mixed}      index.value
     * @param {String}     index.field
     * @param {Object}     attributes
     *
     * @return {Record}
     */
    constructor(
        { connection, tableName },
        { field = 'id', value },
        attributes = {},
    ) {
        super();

        const current = new RegentMap(attributes);
        const loaded  = new RegentMap(attributes);

        $protected.set(this, {
            attributes: {
                current,
                loaded,
            },
            index: {
                field,
                value,
            },
            options: {
                connection,
                table: { name: tableName },
            },
        });
    }

    /**
     * Retrieve a value from the Record
     *
     * @method getAttribute
     *
     * @param {String} attributeName
     * @param {Mixed}  [defaultValue]
     *
     * @return {Mixed}
     */
    getAttribute(attributeName, defaultValue) {
        const { current } = $protected(this).attributes;
        if (!current.has(attributeName)) {
            return defaultValue;
        }

        return current.get(attributeName);
    }

    /**
     * Set a value on the Record
     *
     * @method setAttribute
     *
     * @param {String} attributeName
     * @param {Mixed}  attributeValue
     *
     * @return {this}
     */
    setAttribute(attributeName, attributeValue) {
        const { current } = $protected(this).attributes;
        current.set(attributeName, attributeValue);
        return this;
    }

    /**
     * Get the ID Field Name
     *
     * @method getIdField
     *
     * @return {String}
     */
    getIdField() {
        return $protected(this).index.field;
    }

    /**
     * Get the ID Value
     *
     * @method getId
     *
     * @return {Mixed}
     */
    getId() {
        return $protected(this).index.value;
    }

    /**
     * Save the record
     *
     * @async
     * @method save
     *
     * @return {[type]} [description]
     */
    async save() {
        const { index }  = $protected(this);
        const attributes = this.call(getAttributeDiff).toObject();
        const query      = this.call(getQuery);

        query.where(index.field, index.value);

        const result = await (this.call(noIndex))
            ? query.insert(attributes)
            : query.update(attributes);

        this.call(storeAttributes, result);

        return this;
    }

    /**
     * Load the record
     *
     * @async
     * @method load
     *
     * @param {Mixed} idValue
     *
     * @return {this}
     */
    async load(idValue = this.getId()) {
        const { index } = $protected(this);
        const query     = this.call(getQuery);

        const result = await query.where(index.field, idValue).first();
        this.call(storeAttributes, result);

        return this;
    }
}

/**
 * Open a QueryBuilder object
 *
 * @method getQuery
 *
 * @return {QueryBuilder}
 */
function getQuery() {
    const { options } = $protected(this);
    return options.connection.table(options.table.name);
}

/**
 * Check whether there is a meaningful index value
 *
 * @method noIndex
 *
 * @return {Boolean}
 */
function noIndex() {
    const { index } = $protected(this);
    return Boolean(null === index.value || 'undefined' === typeof index);
}

/**
 * Store attributes into the internal copy
 *
 * @method storeAttributes
 *
 * @param {Object} attributes
 *
 * @return {this}
 */
function storeAttributes(attributes) {
    const { index } = $protected(this);
    const internal = this.call(getLoadedAttributes);
    const current  = this.call(getCurrentAttributes);

    current.clear().add(attributes);
    internal.clear().add(attributes);

    // Get the field ID
    if (internal.has(index.field)) {
        index.value = internal.get(index.field);
    }

    return this;
}

/**
 * Get a diff of the internal vs. working copies of the attributes
 *
 * @method getAttributeDiff
 *
 * @return {RegentMap}
 */
function getAttributeDiff() {
    const current = this.call(getCurrentAttributes);
    const loaded  = this.call(getLoadedAttributes);
    const diff    = new RegentMap();

    current.forEach((value, attribute) => {
        if (
            !loaded.has(attribute)
            || (value !== loaded.get(attribute))
        ) {
            diff.set(attribute, value);
        }
    });
}

/**
 * Get the Record's working-copy of the attributes
 *
 * @method getCurrentAttributes
 *
 * @return {RegentMap}
 */
function getCurrentAttributes() {
    return $protected(this).attributes.current;
}

/**
 * Get the Record's internal-copy of the attributes
 *
 * @method getLoadedAttributes
 *
 * @return {RegentMap}
 */
function getLoadedAttributes() {
    return $protected(this).attributes.loaded;
}

module.exports = Record;
