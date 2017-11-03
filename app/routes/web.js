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

    const uuid = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
    router.get('user/{id?}', (request, response, { variables }) => {
        return `User ID: ${variables.get('id')}`;
    }).where({ id: uuid });

    router.get('/variable/{variable}/{optional?}', function(request, response, { variables }) {
        response.setBody(
`Variable: ${variables.get('variable')}
Optional: ${variables.get('optional')}`
        ).send();
    }).where('optional', '[a-f0-9]+');
};

module.exports = loadWebRoutes;
