/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

function loadWebRoutes(router)
{
    // Your routes are defined in here

    router.resource('/', requireApp('http/controllers/index'), {
        only: ['index']
    });

    router.get('/variable/{variable}/{optional?}', function(request, response, { variables }) {
        response.setBody(
`Variable: ${variables.get('variable')}
Optional: ${variables.get('optional')}`
        ).send();
    }).where('optional', '[a-f0-9]+');
};

module.exports = loadWebRoutes;
