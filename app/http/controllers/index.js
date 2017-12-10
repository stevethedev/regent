'use strict';

const HttpController = requireApp('http/controller');

class IndexHttpController extends HttpController {
    initialize() {
        //
    }

    index() {
        return this.view('index.njk');
    }
}

module.exports = IndexHttpController;
