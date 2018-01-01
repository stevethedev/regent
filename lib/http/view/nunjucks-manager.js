/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert         = requireLib('util/assert');
const Nunjucks       = require('nunjucks');
const ObjectMerger   = requireLib('util/object-merger');
const ViewManager    = requireLib('http/view/view-manager');
const { $protected } = requireLib('util/scope')();
const viewPath       = resolveView();

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
