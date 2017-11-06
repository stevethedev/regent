/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert         = requireLib('util/assert');
const deepmerge      = require('deepmerge');
const Nunjucks       = require('nunjucks');
const ViewManager    = requireLib('http/view/view-manager');
const { _protected } = requireLib('util/scope')();
const viewPath       = resolveView();

const njkConfig   = {
    autoescape: true,
    thrownOnUndefined: false,
    trimBlocks: false,
    lstripBlocks: false,
    watch: false,
    noCache: false,
    tags: {
        blockStart   : '{%',
        blockEnd     : '%}',
        variableStart: '{{',
        variableEnd  : '}}',
        commentStart : '{#',
        commentEnd   : '#}',
    },
};

class NunjucksManager extends ViewManager
{
    constructor(regent, options = {})
    {
        assert.isObject(options);

        super(regent);

        const that = _protected(this);
        that.config = deepmerge.all([{}, njkConfig, options]);
        that.nunjucks = Nunjucks;
        that.nunjucks.configure(viewPath, that.config);
    }

    async render(viewName, context)
    {
        assert.isString(viewName);
        if ('undefined' !== typeof context) {
            assert.isObject(context);
        }

        const that = _protected(this);

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
