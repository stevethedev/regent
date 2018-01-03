'use strict';

const BaseHttpController = require('regent/lib/http/controllers/abstract');

class HttpController extends BaseHttpController {
    /*
     |--------------------------------------------------------------------------
     | Initializer
     |--------------------------------------------------------------------------
     |
     | When constructors are initialized, the HttpController::initialize method
     | is called. This helps to maintain simplicity without sacrificing the
     | utility that Regent provides. If you have code to initialize at
     | instantiation, this is probably where you'll want to put it.
     |
     */
    initialize() {
        // Pseudo-constructor
    }
}

module.exports = HttpController;
