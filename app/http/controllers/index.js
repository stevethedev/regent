'use strict';

const HttpController = require('regent/app/http/controller');

class IndexHttpController extends HttpController {
    initialize() {
        //
    }

    index() {
        return this.view('index.njk');
    }
}

module.exports = IndexHttpController;
