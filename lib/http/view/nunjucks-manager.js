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

const njkTags = {
    blockEnd     : '%}',
    blockStart   : '{%',
    commentEnd   : '#}',
    commentStart : '{#',
    variableEnd  : '$}',
    variableStart: '{$',
};

const njkConfig   = {
    autoescape       : true,
    lstripBlocks     : false,
    noCache          : false,
    tags             : njkTags,
    thrownOnUndefined: false,
    trimBlocks       : false,
    watch            : false,
};

class NunjucksManager extends ViewManager {
    constructor(regent, options = {}) {
        assert.isObject(options);

        super(regent);

        const viewDir = regent.getDir(VIEW_DIR);

        const config = ObjectMerger.create().merge({}, njkConfig, options);
        const nunjucks = Nunjucks;
        nunjucks.configure(viewDir.resolve(), config);

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
        if ('undefined' !== typeof context) {
            assert.isObject(context);
        }

        const { nunjucks } = $protected(this);

        return new Promise((resolve, reject) => {
            nunjucks.render(viewName, context, (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    }
}

module.exports = NunjucksManager;
