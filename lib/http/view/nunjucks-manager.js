/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert         = require('regent-js/lib/util/assert');
const Nunjucks       = require('nunjucks');
const ObjectMerger   = require('regent-js/lib/util/object-merger');
const ViewManager    = require('regent-js/lib/http/view/view-manager');
const { $protected } = require('regent-js/lib/util/scope').create();
const { VIEW_DIR }   = require('regent-js/lib/core/directories/entries');

const njkConfig   = {
    autoescape  : true,
    lstripBlocks: false,
    noCache     : false,
    tags        : {
        block   : [ '{%', '%}' ],
        comment : [ '{#', '#}' ],
        variable: [ '{$', '$}' ],
    },
    thrownOnUndefined: false,
    trimBlocks       : false,
    watch            : false,
};

class NunjucksManager extends ViewManager {
    constructor(regent, options = {}) {
        assert.isObject(options);

        super(regent);

        const viewDir = regent.getDir(VIEW_DIR);

        const merger = ObjectMerger.create({ arrayMerge: false });
        const config = merger.merge({}, njkConfig, options);
        config.tags = {
            blockEnd     : config.tags.block[1],
            blockStart   : config.tags.block[0],
            commentEnd   : config.tags.comment[1],
            commentStart : config.tags.comment[0],
            variableEnd  : config.tags.variable[1],
            variableStart: config.tags.variable[0],
        };
        const nunjucks = Nunjucks.configure(viewDir.resolve(), config);

        $protected.set(this, {
            config,
            nunjucks,
        });
    }

    /**
     * Render a view
     *
     * @method render
     * @async
     *
     * @param {String} viewName
     * @param {Object} context
     *
     * @return {String}
     */
    render(viewName, context) {
        assert.isString(viewName);
        if ('undefined' === typeof context) {
            context = {};
        }
        assert.isObject(context);

        const { nunjucks } = $protected(this);

        return new Promise((resolve, reject) => {
            return nunjucks.render(viewName, context, (err, result) => {
                return (err) ? reject(err) : resolve(result);
            });
        });
    }
}

module.exports = NunjucksManager;
