/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = requireLib('util/assert');
const RegentMap    = requireLib('support/map');

const CLASS_NAME   = RegentMap.name;

const getMap = (param = { foo: 'foo', bar: 'bar' }) => new RegentMap(param);

describe(`The ${CLASS_NAME} class`, () => {
    describe('construction', () => {
        it('can take no parameters', () => {
            new RegentMap();
        });
        it('can take an array parameter', () => {
            getMap({ foo: 'foo', bar: 'bar' });
        });
        it('can take an object parameter', () => {
            getMap({ foo: 'FOO' });
        });
        it('should throw an error if a null parameter is provided', () => {
            assert.throws(() => getMap(null));
        });
        it('should throw an error if a boolean parameter is provided', () =>  {
            assert.throws(() => getMap(false));
            assert.throws(() => getMap(true));
        });
        it('should throw an error if a string parameter is provided', () =>  {
            assert.throws(() => getMap('foo'));
        });
        it('should throw an error if a function parameter is provided', () =>  {
            assert.throws(() => getMap(() => {}));
        });
        it('should throw an error if a number parameter is provided', () =>  {
            assert.throws(() => getMap(5));
        });
    });
    describe('clear method', () => {
        it('should remove all values', () => {
            const collection = getMap({ foo: 'foo', bar: 'bar' });
            collection.clear();
            assert.equal(collection.size(), 0);
        });
        it('should return the collection', () => {
            const collection = getMap();
            assert.equal(collection.clear(), collection);
        });
    });
    describe('delete method', () => {
        it('should return true if an element existed and has been removed', () => {
            const collection = getMap({ foo: 'foo', bar: 'bar' });
            assert.isTrue(collection.delete('foo'));
        });
        it('should return false if an element did not exist at the specified key', () => {
            const collection = new RegentMap({ foo: 'foo', bar: 'bar' });
            assert.isFalse(collection.delete('baz'));
        });
        it('should remove the given key from the collection', () => {
            const collection = getMap({ foo: 'foo', bar: 'bar' });
            collection.delete(0);
            assert.isFalse(collection.has(0));
        });
        it('should not remove the non-given keys from the collection', () => {
            const collection = getMap({ foo: 'foo', bar: 'bar' });
            collection.delete(0);
            assert.isTrue(collection.has('foo'));
        });
    });
    describe('filter method', () => {
        it('should take a callback function as the first parameter', () => {
            const collection = getMap({ foo: 'foo', bar: 'bar' });
            collection.filter(() => {});
        });
        it('should execute the callback function for each entry', () => {
            const array = { foo: 'foo', bar: 'bar' };
            const collection = getMap(array);
            let i = 0;
            collection.filter(() => ++i);
            assert.equal(i, 2);
        });
        it('should return a new collection object', () => {
            const collection = getMap();
            assert.notEqual(collection.filter(), collection);
            assert.instanceOf(collection.filter(), RegentMap);
        });
        it('should not remove entries from the current collection', () => {
            const array = { foo: 'foo', bar: 'bar' };
            const collection = getMap(array);
            collection.filter(() => false);
            assert.equal(collection.size(), 2);
        });
        it('should remove entries where the callback returned false', () => {
            const collection = getMap({ foo: 'foo', bar: 'bar' }).filter(() => false);
            assert.equal(collection.size(), 0);
        });
        it('should retain entries where the callback returned true', () => {
            const array = { foo: 'foo', bar: 'bar' };
            const collection = getMap(array).filter(() => true);
            assert.equal(collection.size(), 2);
        });
    });
    describe('forEach method', () => {
        it('should fire a callback for each key/value pair', () => {
            const array = { foo: 'foo', bar: 'bar' };
            const collection = getMap(array);
            let i = 0;
            collection.forEach(() => ++i);
            assert.equal(i, 2);
        });
        it('should return the collection', () => {
            const collection = getMap();
            assert.equal(collection.forEach(), collection);
        });
    });
    describe('get method', () => {
        it('should return the value at a given key if one exists', () => {
            const array = { foo: 'foo', bar: 'bar' };
            const collection = getMap(array);
            assert.equal(collection.get(0), array[0]);
        });
    });
    describe('has method', () => {
        it('should return true if a value exists at the given key', () => {
            const collection = getMap({ foo: 'foo', bar: 'bar' });
            assert.isTrue(collection.has('foo'));
        });
        it('should return false if a value does not exist at the given key', () => {
            const collection = getMap({});
            assert.isFalse(collection.has('foo'));
        });
    });
    describe('keys method', () => {
        it('should return an array', () => {
            const collection = getMap({});
            assert.isArray(collection.keys());
        });
        it('should return each key in the new collection', () => {
            const object = {
                'foo': 'foo',
                'bar': 'bar'
            };
            const keys = getMap(object).keys();
            assert.equal(keys.length, Object.keys(object).length);
            keys.forEach((key) => assert.isTrue(object.hasOwnProperty(key)));
        });
    });
    describe('map method', () => {
        it('should fire a callback for each key/value pair', () => {
            const array = { foo: 'foo', bar: 'bar' };
            const collection = getMap(array);
            let i = 0;
            collection.map(() => ++i);
            assert.equal(i, 2);
        });
        it('should return a new collection', () => {
            const collection = getMap();
            assert.notEqual(collection.map(), collection);
        });
        it('should return a collection containing the values returned from the callback', () => {
            const collection = getMap([1, 2, 3, 4, 5]);
            const mapped = collection.map(() => true);
            mapped.forEach((value) => assert.equal(value, true));
        });
    });
    describe('pop method', () => {
        it('should return the last item from the collection', () => {
            const array = { foo: 'foo' };
            const collection = getMap(array);
            assert.equal(collection.pop(), 'foo');
        });
        it('should remove the last item from the collection', () => {
            const array = { foo: 'foo', bar: 'bar' };
            const collection = getMap(array);
            collection.pop();
            assert.equal(collection.size(), 1);
        });
    });
    describe('push method', () => {
        it('should append an item to the end of the collection', () => {
            const array = { foo: 'foo', bar: 'bar' };
            const collection = getMap(array);
            collection.push('baz', 'baz');
            assert.equal(collection.size(), 3);
        });
        it('should return the collection', () => {
            const collection = getMap();
            assert.equal(collection.push(), collection);
        });
    });
    describe('reduce method', () => {
        it('should return a single value', () => {
            const array = { foo: 'foo', bar: 'bar' };
            const collection = getMap(array);
            const reducer = (a, b) => (a || '') + b;
            assert.equal(collection.reduce(reducer), 'foobar');
        });
        it('should accept a function in the first parameter', () => {
            getMap().reduce(() => {});
        });
        it('should execute the callback for every entry', () => {
            const array = { foo: 'foo', bar: 'bar' };
            const collection = getMap(array);
            let i = 0;
            collection.reduce(() => ++i);
            assert.equal(i, collection.size());
        });
        it('should accept a default first-value in the second parameter', () => {
            const compare = {};
            getMap([0]).reduce((a) => assert.equal(a, compare), compare);
        });
        it('should use NULL as the first value on the first parameter if no default is provided', () => {
            getMap([0]).reduce((a) => assert.isNull(a));
        });
    });
    describe('set method', () => {
        it('should set the given value at the given key', () => {
            const array = { foo: 'foo', bar: 'bar' };
            const collection = getMap(array);
            collection.set('baz', 'bar');
            assert.equal(collection.size(), 3);
        });
        it('should return the collection', () => {
            const array = { foo: 'foo', bar: 'bar' };
            const collection = getMap(array);
            assert.equal(collection.set('foo', 'bar'), collection);
        });
    });
    describe('shift method', () => {
        it('should return the value from the front of the collection', () => {
            const array = { foo: 'foo' };
            const collection = getMap(array);
            assert.equal(collection.shift(), 'foo');
        });
        it('should remove the value from the front of the collection', () => {
            const array = { foo: 'foo', bar: 'bar' };
            const collection = getMap(array);
            collection.shift();
            assert.equal(collection.size(), 1);
        });
    });
    describe('size method', () => {
        it('should return the number of keys on the value', () => {
            const array = { foo: 'foo', bar: 'bar' };
            const collection = getMap(array);
            assert.equal(collection.size(), 2);
        });
    });
    describe('unshift method', () => {
        it('should insert a value at the front of the collection', () => {
            const array = { 'foo': 'foo' };
            const collection = getMap(array);
            collection.unshift('bar', 'bar');
            assert.equal(collection.size(), 2);
            assert.equal(collection.get('bar'), 'bar');
        });
        it('should return the collection', () => {
            const array = { foo: 'foo', bar: 'bar' };
            const collection = getMap(array);
            assert.equal(collection.unshift(0), collection);
        });
    });
    describe('values method', () => {
        it('should return a new collection', () => {
            const array = { foo: 'foo', bar: 'bar' };
            const collection = getMap(array);
            const values = collection.values();
            assert.instanceOf(values, RegentMap);
            assert.notEqual(values, collection);
        });
        it('should reset each key in the returned collection to consecutive integers', () => {
            const object = { 'foo': 'foo', 'bar': 'bar' };
            const collection = getMap(object);
            const values = collection.values();
            let integer = 0;
            values.forEach((value, index) => assert.equal(index, integer++));
        });
    });
});
