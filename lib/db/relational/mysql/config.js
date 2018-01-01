/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const ObjectMerger   = requireLib('util/object-merger');

const BASE_CONFIG    = requireLib('db/relational/config');

module.exports = ObjectMerger.create().merge(BASE_CONFIG, { port: 3306 });
