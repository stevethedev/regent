/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert         = require('regent-js/lib/util/assert');
const Nunjucks       = require('nunjucks');
const ObjectMerger   = require('regent-js/lib/util/object-merger');
const ViewManager    = require('regent-js/lib/http/view/view-manager');
const Directories    = require('regent-js/bootstrap/directories');
const { $protected } = require('regent-js/lib/util/scope')();

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
        that.nunjucks.configure(Directories.resolveView(), that.config);
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
