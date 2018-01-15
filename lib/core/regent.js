/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const Regent = require('regent-js/lib/core/base/regent');

// Apply the mixins
const databaseMixin = require('regent-js/lib/core/mixins/database');

databaseMixin(Regent);

module.exports = Regent;
