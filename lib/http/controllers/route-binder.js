/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const ObjectMerger = require('regent-js/lib/util/object-merger');
const RegentObject = require('regent-js/lib/util/regent-object');
const RouteNames   = require('regent-js/lib/http/routing/route-names');
const { $protected } = require('regent-js/lib/util/scope').create();

const SETTING_MIDDLEWARE = 'middleware';

class HttpRouteBinder extends RegentObject {
    constructor(regent, router) {
        super(regent);
        $protected(this).router = router;
    }

    /**
     * Retrieve the owning router object
     *
     * @return {HttpRouter}
     */
    getRouter() {
        return $protected(this).router;
    }

    /**
     * Bind a controller to a router using the given settings
     *
     * @param {HttpController} Controller - A controller object to bind
     * @param {String}         baseUri    - The URI to bind
     * @param {Dictionary}     settings   - The settings dictionary to use
     *
     * @return {this}
     */
    bindController(Controller, baseUri, settings = {}) {
        settings = this.call(fillSettings, settings);
        const router = this.getRouter();
        const actions = this.call(getActions, settings);

        actions.forEach((action) => {
            const methods    = [action.method];
            const uri        = `${baseUri}${action.uri}`.replace('//', '/');
            const options    = settings.options || {};
            const name       = settings.name || baseUri.split('/').pop();
            const middleware = settings[SETTING_MIDDLEWARE];
            const handler = async function(request, response, ...args) {
                await request.addMiddleware(...middleware);
                const ctl = new Controller(this.getRegent(), request, response);
                const fn  = ctl[action.action];
                if ('function' !== typeof fn) {
                    throw new TypeError('Missing Route');
                }
                return ctl.call(fn, ...args);
            };

            if ('function' !== typeof Controller.prototype[action.action]) {
                this.getRegent().getLogger()
                    .warn(
                        `${Controller.name} has no method named `,
                        `${action.action}. This may cause problems if a user `,
                        `attempts to connect to HTTP ${action.method} ${uri}`
                    );
            }

            router
                .match(methods, uri, handler, options)
                .setName(`${name}.${action.action}`);
        });

        return this;
    }
}

/**
 * Determine the available actions from the settings dictionary.
 *
 * @private
 * @method getActions
 *
 * @param {String[]} [options.only]   - If defined, only these actions will be
 *                                      included
 * @param {String[]} [options.except] - If defined, these actions will not be
 *                                      included
 *
 * @return {Dictionary[]} The filtered actions list
 */
function getActions({ only, except }) {
    const possibleRoutes = [
        RouteNames.ROUTE_INDEX,
        RouteNames.ROUTE_CREATE,
        RouteNames.ROUTE_STORE,
        RouteNames.ROUTE_SHOW,
        RouteNames.ROUTE_EDIT,
        RouteNames.ROUTE_UPDATE,
        RouteNames.ROUTE_REPLACE,
        RouteNames.ROUTE_DELETE,
    ];

    const routes = [];

    possibleRoutes.forEach((routeName) => {
        let insertRoute = true;
        if (only && !only.includes(routeName.action)) {
            insertRoute = false;
        }
        if (except && except.includes(routeName.action)) {
            insertRoute = false;
        }
        if (insertRoute) {
            routes.push(routeName);
        }
    });

    return routes;
}

/**
 * Fill in the missing settings with default values
 *
 * @private
 * @method fillSettings
 *
 * @param {Dictionary} settings
 *
 * @return {Dictionary}
 */
function fillSettings(settings) {
    const defaults = { [SETTING_MIDDLEWARE]: [] };
    return ObjectMerger.create().merge(defaults, settings);
}

module.exports = HttpRouteBinder;
