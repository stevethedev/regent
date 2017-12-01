/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = requireLib('util/assert');
const Collection   = requireLib('support/collection');

const CLASS_NAME   = Collection.name;

const getCollection = (param = [1, 2, 3]) => new Collection(param);

describe(`The ${CLASS_NAME} class`, () => {
    describe('construction', () => {
        it('can take no parameters', () => {
            new Collection();
        });
        it('can take an array parameter', () => {
            getCollection([1, 2, 3]);
        });
        it('can take an object parameter', () => {
            getCollection({ foo: 'FOO' });
        });
        it('should throw an error if a null parameter is provided', () => {
            assert.throws(() => getCollection(null));
        });
        it('should throw an error if a boolean parameter is provided', () =>  {
            assert.throws(() => getCollection(false));
            assert.throws(() => getCollection(true));
        });
        it('should throw an error if a string parameter is provided', () =>  {
            assert.throws(() => getCollection('foo'));
        });
        it('should throw an error if a function parameter is provided', () =>  {
            assert.throws(() => getCollection(() => {}));
        });
        it('should throw an error if a number parameter is provided', () =>  {
            assert.throws(() => getCollection(5));
        });
    });
    describe('clear method', () => {
        it('should remove all values', () => {
            const collection = getCollection([1, 2, 3]);
            collection.clear();
            assert.equal(collection.size(), 0);
        });
        it('should return the collection', () => {
            const collection = getCollection();
            assert.equal(collection.clear(), collection);
        });
    });
    describe('delete method', () => {
        it('should return true if an element existed and has been removed', () => {
            const collection = getCollection([1, 2, 3]);
            assert.isTrue(collection.delete(0));
        });
        it('should return false if an element did not exist at the specified key', () => {
            const collection = new Collection([1, 2, 3]);
            assert.isFalse(collection.delete('foo'));
        });
        it('should remove the given key from the collection', () => {
            const collection = getCollection([1, 2, 3]);
            collection.delete(0);
            assert.isFalse(collection.has(0));
        });
        it('should not remove the non-given keys from the collection', () => {
            const collection = getCollection([1, 2, 3]);
            collection.delete(0);
            assert.isFalse(collection.has(1));
        });
    });
    describe('filter method', () => {
        it('should take a callback function as the first parameter', () => {
            const collection = getCollection([1, 2, 3]);
            collection.filter(() => {});
        });
        it('should execute the callback function for each entry', () => {
            const array = [1, 2, 3];
            const collection = getCollection(array);
            let i = 0;
            collection.filter(() => ++i);
            assert.equal(i, array.length);
        });
        it('should return a new collection object', () => {
            const collection = getCollection();
            assert.isNotEqual(collection.filter(), collection);
            assert.instanceOf(collection.filter(), Collection);
        });
        it('should not remove entries from the current collection', () => {
            const array = [1, 2, 3];
            const collection = getCollection(array);
            collection.filter(() => false);
            assert.equal(collection.size(), array.length);
        });
        it('should remove entries where the callback returned false', () => {
            const collection = getCollection([1, 2, 3]).filter(() => false);
            assert.equal(collection.size(), 0);
        });
        it('should retain entries where the callback returned true', () => {
            const array = [1, 2, 3];
            const collection = getCollection(array).filter(() => true);
            assert.equal(collection.size(), array.length);
        });
    });
    describe('forEach method', () => {
        it('should fire a callback for each key/value pair', () => {
            const array = [1, 2, 3];
            const collection = getCollection(array);
            let i = 0;
            collection.forEach(() => ++i);
            assert.equal(i, array.length);
        });
        it('should return the collection', () => {
            const collection = getCollection();
            assert.equal(collection.forEach(), collection);
        });
    });
    describe('get method', () => {
        it('should return the value at a given key if one exists', () => {
            const array = [1, 2, 3];
            const collection = getCollection(array);
            assert.equal(collection.get(0), array[0]);
        });
    });
    describe('has method', () => {
        it('should return true if a value exists at the given key', () => {
            const collection = getCollection([1, 2, 3]);
            assert.isTrue(collection.has(0));
        });
        it('should return false if a value does not exist at the given key', () => {
            const collection = getCollection({});
            assert.isFalse(collection.has('foo'));
        });
    });
    describe('keys method', () => {
        it('should return a new collection', () => {
            const collection = getCollection({});
            assert.instanceOf(collection.keys(), Collection);
        });
        it('should return each key in the new collection', () => {
            const object = {
                'foo': 'foo',
                'bar': 'bar'
            };
            const keys = getCollection(object).keys();
            assert.equal(keys.size(), Object.keys(object).length);
            keys.forEach((key) => assert.isTrue(object.hasOwnProperty(key)));
        });
    });
    describe('map method', () => {
        it('should fire a callback for each key/value pair', () => {
            const array = [1, 2, 3];
            const collection = getCollection(array);
            let i = 0;
            collection.map(() => ++i);
            assert.equal(i, array.length);
        });
        it('should return a new collection', () => {
            const collection = getCollection();
            assert.isNotEqual(collection.map(), collection);
        });
        it('should return a collection containing the values returned from the callback', () => {
            const collection = getCollection([1, 2, 3, 4, 5]);
            const mapped = collection.map(() => true);
            mapped.forEach((value) => assert.equal(value, true));
        });
    });
    describe('pop method', () => {
        it('should return the last item from the collection', () => {
            const array = [1, 2, 3];
            const collection = getCollection(array);
            assert.equal(collection.pop(), array.pop());
        });
        it('should remove the last item from the collection', () => {
            const array = [1, 2, 3];
            const collection = getCollection(array);
            collection.pop();
            array.pop();
            assert.equal(collection.size(), array.length);
        });
    });
    describe('push method', () => {
        it('should append an item to the end of the collection', () => {
            const array = [1, 2, 3];
            const collection = getCollection(array);
            array.push(4);
            collection.push(4);
            assert.equal(collection.size(), array.length);
        });
        it('should accept any number of parameters', () => {
            const array = [1, 2, 3];
            const collection = getCollection([]);
            collection.push(...array);
            assert.equal(collection.size(), array.length);
        });
        it('should return the collection', () => {
            const collection = getCollection();
            assert.equal(collection.push(), collection);
        });
    });
    describe('values method', () => {
        it('should return a new collection', () => {
            const array = [1, 2, 3];
            const collection = getCollection(array);
            const values = collection.values();
            assert.instanceOf(values, Collection);
            assert.isNotEqual(values, collection);
        });
        it('should reset each key in the returned collection to consecutive integers', () => {
            const object = { 'foo': 'foo', 'bar': 'bar' };
            const collection = getCollection(object);
            const values = collection.values();
            let integer = 0;
            values.forEach((value, index) => assert.isEqual(index, integer++));
        });
    });
    describe('reduce method', () => {
        it('should return a single value', () => {
            const array = [1, 2, 3];
            const collection = getCollection(array);
            const reducer = (a, b) => (a || 0) + b;
            assert.equal(collection.reduce(reducer), array.reduce(reducer));
        });
        it('should accept a function in the first parameter', () => {
            getCollection().reduce(() => {});
        });
        it('should execute the callback for every entry', () => {
            const array = [1, 2, 3];
            const collection = getCollection(array);
            let i = 0;
            collection.reduce(() => ++i);
            assert.equal(i, collection.size());
        });
        it('should accept a default first-value in the second parameter', () => {
            const compare = {};
            getCollection([0]).reduce((a) => assert.equal(a, compare), compare);
        });
        it('should use NULL as the first value on the first parameter if no default is provided', () => {
            getCollection([0]).reduce((a) => assert.isNull(a));
        });
    });
    describe('set method', () => {
        it('should set the given value at the given key', () => {
            const array = [1, 2, 3];
            const collection = getCollection(array);
            collection.set('foo', 'bar');
            assert.equal(collection.size(), array.length + 1);
        });
        it('should return the collection', () => {
            const array = [1, 2, 3];
            const collection = getCollection(array);
            assert.equal(collection.set('foo', 'bar'), collection);
        });
    });
    describe('shift method', () => {
        it('should return the value from the front of the collection', () => {
            const array = [1, 2, 3];
            const collection = getCollection(array);
            assert.equal(collection.shift(), array.shift());
        });
        it('should remove the value from the front of the collection', () => {
            const array = [1, 2, 3];
            const collection = getCollection(array);
            array.shift();
            collection.shift();
            assert.equal(collection.size(), array.length);
        });
    });
    describe('size method', () => {
        it('should return the number of keys on the value', () => {
            const array = [1, 2, 3];
            const collection = getCollection(array);
            assert.equal(collection.size(), array.length);
        });
    });
    describe('unshift method', () => {
        it('should insert a value at the front of the collection', () => {
            const array = [1, 2, 3];
            const collection = getCollection(array);
            array.unshift(0);
            collection.unshift(0);
            assert.equal(collection.size(), array.length);
            assert.equal(collection.get(0), array[0]);
        });
        it('should take any number of arguments', () => {
            const array = [1, 2, 3];
            const collection = getCollection([]);
            collection.unshift(...array);
            assert.equal(collection.size(), array.length);
        });
        it('should return the collection', () => {
            const array = [1, 2, 3];
            const collection = getCollection(array);
            assert.equal(collection.unshift(0), collection);
        });
    });
});
