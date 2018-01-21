/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert     = require('regent-js/lib/util/assert');
const Session    = require('regent-js/lib/http/session');

const CLASS_NAME = Session.name;


describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        describe(
            '(<regent>, <manager>, <sessionId>, <internal>) signature',
            () => {
                it(`should return a ${CLASS_NAME} object`);
                it('should seed the session data with <internals>');
            },
        );
        describe('(<regent>, <manager>, <sessionId>) signature', () => {
            it(`should return a ${CLASS_NAME} object`);
        });
    });
    describe('getId method', () => {
        describe('() signature', () => {
            it(`should return the ${CLASS_NAME} id`);
        });
    });
    describe('get method', () => {
        describe('(<key>) signature', () => {
            it('should return the value at <key>');
            it('should return NULL if no value is at <key>');
        });
    });
    describe('set method', () => {
        describe('(<key>, <value>) signature', () => {
            it('should add the <key:value> pair to the session');
            it(`should return the ${CLASS_NAME} object`);
        });
    });
    describe('remove method', () => {
        describe('(<key>) signature', () => {
            it('should remove <key> from the session');
            it(`should return the ${CLASS_NAME} object`);
        });
    });
    describe('save method', () => {
        describe('() signature', () => {
            it('should return a Promise');
            it(`should resolve to the ${CLASS_NAME} object`);
            it('should save the session data into storage');
        });
    });
    describe('reload method', () => {
        describe('() signature', () => {
            it('should return a Promise');
            it(`should resolve to the ${CLASS_NAME} object`);
            it('should reload session data from the latest saved version');
        });
    });
    describe('clone method', () => {
        describe('() signature', () => {
            it('should clone the session data into a new session id');
            it(`should return the newly created ${CLASS_NAME} object`);
        });
        describe('(<intoId>) signature', () => {
            it('should clone the session into session id <intoId>');
            it(`should return the newly created ${CLASS_NAME} object`);
        });
    });
    describe('drop method', () => {
        describe('() signature', () => {
            it('should return a Promise');
            it(`should resolve to the ${CLASS_NAME} object`);
            it('should destroy the session');
        });
    });
});
