/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = requireLib('util/assert');
const Collection   = requireLib('support/collection');

const CLASS_NAME   = Collection.name;

describe(`The ${CLASS_NAME} class`, () => {
    describe('construction', () => {
        it('can take no parameters');
        it('can take an array parameter');
        it('will throw an error if a non-array parameter is provided');
    });
    describe('clear method', () => {
        it('should remove all values');
    });
    describe('delete method', () => {
        it('should return true if an element existed and has been removed');
        it('should return false if an element did not exist at the specified key');
        it('should remove the given key from the collection');
    });
    describe('filter method', () => {
        it('should take a callback function as the first parameter');
        it('should execute the callback function for each entry');
        it('should remove entries where the callback returned false');
        it('should retain entries where the callback returned true');
        it('should return a new collection');
    });
    describe('forEach method', () => {
        it('should fire a callback for each key/value pair');
        it('should return the collection');
    });
    describe('get method', () => {
        it('should return the value at a given key if one exists');
    });
    describe('has method', () => {
        it('should return true if a value exists at the given key');
        it('should return false if a value does not exist at the given key');
    });
    describe('keys method', () => {
        it('should return a new collection');
        it('should return each key in the new collection');
    });
    describe('map method', () => {
        it('should fire a callback for each key/value pair');
        it('should return a collection containing the values returned from the callback');
    });
    describe('pop method', () => {
        it('should return the last item from the collection');
        it('should remove the last item from the collection');
    });
    describe('push method', () => {
        it('should append an item to the end of the collection');
        it('should accept any number of parameters');
        it('should return the collection');
    });
    describe('values method', () => {
        it('should return a new collection');
        it('should reset each key in the returned collection to consecutive integers');
    });
    describe('reduce method', () => {
        it('should return a single value');
        it('should accept a function in the first parameter');
        it('should accept a default first-value in the second parameter');
        it('should use NULL as the first value on the first parameter if no default is provided');
    });
    describe('set method', () => {
        it('should set the given value at the given key');
        it('should return the collection');
    });
    describe('shift method', () => {
        it('should return the value from the front of the collection');
        it('should remove the value from the front of the collection');
    });
    describe('size method', () => {
        it('should return the number of keys on the value');
    });
    describe('unshift method', () => {
        it('should insert a value at the front of the collection');
        it('should return the collection');
    });
});
