/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const make = (action, method, uri) => ({
    action,
    method,
    uri,
});

const ROUTE_INDEX   = make('index',   'GET',    '');
const ROUTE_CREATE  = make('create',  'GET',    '/create');
const ROUTE_STORE   = make('store',   'POST',   '');
const ROUTE_SHOW    = make('show',    'GET',    '/{id}');
const ROUTE_EDIT    = make('edit',    'GET',    '/{id}/edit');
const ROUTE_UPDATE  = make('update',  'PATCH',  '/{id}');
const ROUTE_REPLACE = make('replace', 'PUT',    '/{id}');
const ROUTE_DELETE  = make('destroy', 'DELETE', '/{id}');

module.exports = {
    ROUTE_CREATE,
    ROUTE_DELETE,
    ROUTE_EDIT,
    ROUTE_INDEX,
    ROUTE_REPLACE,
    ROUTE_SHOW,
    ROUTE_STORE,
    ROUTE_UPDATE,
};
