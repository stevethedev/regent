
'use strict';

const { stripIndent } = require('common-tags');
const index = require('regent-js/app/http/controllers/index');

/*
 |------------------------------------------------------------------------------
 | HTTP Web Routes
 |------------------------------------------------------------------------------
 |
 | The application's HTTP Web Routes are defined in this file, and this file is
 | automatically loaded when Regent starts. Once the routes are ingested and
 | initialized, they are compiled in the HTTP Router for improved speed.
 |
 */

function loadWebRoutes(router) {
    // Your routes are defined in here

    router.resource('/', index, { only: ['index'] });

    const uuid = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
    router.get('user/{id?}', (request, response, { variables }) => {
        return `User ID: ${variables.get('id')}`;
    }).setPattern({ 'id': uuid });

    router.get(
        '/variable/{variable}/{optional?}',
        (request, response, { variables }) => {
            response.setBody(stripIndent`
                Variable: ${variables.get('variable')}
                Optional: ${variables.get('optional')}
            `).send();
        }).setPattern('optional', '[a-f0-9]+');
}

module.exports = loadWebRoutes;
