/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const Collection = require('regent-js/lib/support/collection');
const { $protected } = require('regent-js/lib/util/scope').create();

class Response extends Collection {
    /**
     * Contain responses from the Database
     *
     * @method constructor
     *
     * @param {Array}   source
     * @param {Integer} rowCount
     *
     * @return {this}
     */
    constructor(source = [], rowCount) {
        super(source);
        this.setRowCount(rowCount);
    }

    /**
     * Set the row-count for the response set
     *
     * @method setRowCount
     *
     * @param {Integer} rowCount
     *
     * @return {this}
     */
    setRowCount(rowCount) {
        rowCount = (rowCount|0) || 0;
        $protected.set(this, { rowCount });
        return this;
    }

    /**
     * Retrieve the row-count for the response set
     *
     * @method getRowCount
     *
     * @return {Integer}
     */
    getRowCount() {
        return $protected(this).rowCount;
    }
}

module.exports = Response;
