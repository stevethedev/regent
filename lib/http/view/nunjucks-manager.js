/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert         = require('regent/lib/util/assert');
const Nunjucks       = require('nunjucks');
const ObjectMerger   = require('regent/lib/util/object-merger');
const ViewManager    = require('regent/lib/http/view/view-manager');
const directories    = require('regent/bootstrap/directories');
const { $protected } = require('regent/lib/util/scope')();
const viewPath       = directories.resolveView();

const njkTags = {
    blockEnd     : '%}',
    blockStart   : '{%',
    commentEnd   : '#}',
    commentStart : '{#',
    variableEnd  : '}}',
    variableStart: '{{',
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

        const that = $protected(this);
        that.config = ObjectMerger.create().merge({}, njkConfig, options);
        that.nunjucks = Nunjucks;
        that.nunjucks.configure(viewPath, that.config);
    }

    render(viewName, context) {
        assert.isString(viewName);
        if ('undefined' !== typeof context) {
            assert.isObject(context);
        }

        const that = $protected(this);

        return new Promise((resolve, reject) => {
            that.nunjucks.render(viewName, context, (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    }
}

module.exports = NunjucksManager;
