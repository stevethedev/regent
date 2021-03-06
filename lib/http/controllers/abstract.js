/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const RegentObject = require('regent-js/lib/util/regent-object');

const { $private } = require('regent-js/lib/util/scope').create();

class HttpController extends RegentObject {
    constructor(regent, request, response) {
        super(regent);

        $private.set(this, {
            request,
            response,
        });
    }

    /**
     * Retrieve the HTTP Request object that triggered this controller
     *
     * @return {HttpRequest}
     */
    getRequest() {
        return $private(this).request;
    }

    /**
     * Retrieve the HTTP Response object that will be returned to the client
     *
     * @return {HttpResponse}
     */
    getResponse() {
        return $private(this).response;
    }

    /**
     * Add middleware to a controller instance
     *
     * @param {...Middleware} middleware
     *
     * @return {this}
     */
    async middleware(...middleware) {
        await this.getRequest().addMiddleware(...middleware);
        return this;
    }

    /**
     * Load and run a template from the "views" folder, and return the result
     *
     * @param {String}     template   - The relative path of the template
     *                                  to run
     * @param {Dictionary} [context=] - A dictionary of context objects to pass
     *                                  to the template
     *
     * @return {String} Content to return to the client
     */
    view(template, context = {}) {
        return this.getResponse().render(template, context);
    }
}

module.exports = HttpController;
