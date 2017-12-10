/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = requireLib('util/assert');
const RegentSet    = requireLib('support/set');

const CLASS_NAME   = RegentSet.name;
const NUMBER_ONE   = 1;
const NUMBER_TWO   = 2;
const NUMBER_THREE = 3;

const DEFAULT_PARAM = [
    NUMBER_ONE,
    NUMBER_TWO,
    NUMBER_THREE,
];
const getSet = (param = DEFAULT_PARAM) => new RegentSet(param);

describe(`The ${CLASS_NAME} class`, () => {
    describe('construction', () => {
        it('can take no parameters', () => {
            new RegentSet();
        });
        it('can take an array parameter', () => {
            getSet(DEFAULT_PARAM);
        });
        it('should throw an error if an object parameter is provided', () => {
            assert.throws(() => getSet({ foo: 'FOO' }));
        });
        it('should throw an error if a null parameter is provided', () => {
            assert.throws(() => getSet(null));
        });
        it('should throw an error if a boolean parameter is provided', () =>  {
            assert.throws(() => getSet(false));
            assert.throws(() => getSet(true));
        });
        it('should throw an error if a string parameter is provided', () =>  {
            assert.throws(() => getSet('foo'));
        });
        it('should throw an error if a function parameter is provided', () =>  {
            assert.throws(() => getSet(() => {
                //
            }));
        });
        it('should throw an error if a number parameter is provided', () =>  {
            assert.throws(() => getSet(1 + DEFAULT_PARAM.length));
        });
    });
    describe('clear method', () => {
        it('should remove all values', () => {
            const collection = getSet(DEFAULT_PARAM);
            collection.clear();
            assert.equal(collection.size(), 0);
        });
        it('should return the collection', () => {
            const collection = getSet();
            assert.equal(collection.clear(), collection);
        });
    });
    describe('delete method', () => {
        it(
            'should return true if an element existed and has been removed',
            () => {
                const collection = getSet(DEFAULT_PARAM);
                assert.isTrue(collection.delete(NUMBER_TWO));
            }
        );
        it(
            'should return false if an element did not exist at the given key',
            () => {
                const collection = new RegentSet(DEFAULT_PARAM);
                assert.isFalse(collection.delete('foo'));
            }
        );
        it('should remove the given key from the collection', () => {
            const collection = getSet(DEFAULT_PARAM);
            collection.delete(0);
            assert.isFalse(collection.has(0));
        });
        it('should not remove the non-given keys from the collection', () => {
            const collection = getSet(DEFAULT_PARAM);
            collection.delete(0);
            assert.isTrue(collection.has(1));
        });
    });
    describe('filter method', () => {
        it('should take a callback function as the first parameter', () => {
            const collection = getSet(DEFAULT_PARAM);
            collection.filter((value) => value);
        });
        it('should execute the callback function for each entry', () => {
            const array = DEFAULT_PARAM.slice();
            const collection = getSet(array);
            let i = 0;
            collection.filter(() => ++i);
            assert.equal(i, array.length);
        });
        it('should return a new collection object', () => {
            const collection = getSet();
            assert.notEqual(collection.filter(), collection);
            assert.instanceOf(collection.filter(), RegentSet);
        });
        it('should not remove entries from the current collection', () => {
            const array = DEFAULT_PARAM.slice();
            const collection = getSet(array);
            collection.filter(() => false);
            assert.equal(collection.size(), array.length);
        });
        it('should remove entries where the callback returned false', () => {
            const collection = getSet(DEFAULT_PARAM).filter(() => false);
            assert.equal(collection.size(), 0);
        });
        it('should retain entries where the callback returned true', () => {
            const array = DEFAULT_PARAM.slice();
            const collection = getSet(array).filter(() => true);
            assert.equal(collection.size(), array.length);
        });
    });
    describe('forEach method', () => {
        it('should fire a callback for each key/value pair', () => {
            const array = DEFAULT_PARAM.slice();
            const collection = getSet(array);
            let i = 0;
            collection.forEach(() => ++i);
            assert.equal(i, array.length);
        });
        it('should return the collection', () => {
            const collection = getSet();
            assert.equal(collection.forEach(), collection);
        });
    });
    describe('has method', () => {
        it('should return true if a value exists at the given key', () => {
            const collection = getSet(DEFAULT_PARAM);
            assert.isTrue(collection.has(1));
        });
        it(
            'should return false if a value does not exist at the given key',
            () => {
                const collection = getSet([]);
                assert.isFalse(collection.has('foo'));
            }
        );
    });
    describe('map method', () => {
        it('should fire a callback for each key/value pair', () => {
            const array = DEFAULT_PARAM.slice();
            const collection = getSet(array);
            let i = 0;
            collection.map(() => ++i);
            assert.equal(i, array.length);
        });
        it('should return a new collection', () => {
            const collection = getSet();
            assert.notEqual(collection.map(), collection);
        });
        it(
            'should return a collection of values returned from the callback',
            () => {
                const collection = getSet(DEFAULT_PARAM);
                const mapped = collection.map(() => true);
                mapped.forEach((value) => assert.equal(value, true));
            }
        );
    });
    describe('pop method', () => {
        it('should return the last item from the collection', () => {
            const array = DEFAULT_PARAM.slice();
            const collection = getSet(array);
            assert.equal(collection.pop(), array.pop());
        });
        it('should remove the last item from the collection', () => {
            const array = DEFAULT_PARAM.slice();
            const collection = getSet(array);
            collection.pop();
            array.pop();
            assert.equal(collection.size(), array.length);
        });
    });
    describe('push method', () => {
        it('should append an item to the end of the collection', () => {
            const array = DEFAULT_PARAM.slice();
            const collection = getSet(array);
            collection.push(array.length);
            array.push(array.length);
            assert.equal(collection.size(), array.length);
        });
        it('should accept any number of parameters', () => {
            const array = DEFAULT_PARAM.slice();
            const collection = getSet([]);
            collection.push(...array);
            assert.equal(collection.size(), array.length);
        });
        it('should return the collection', () => {
            const collection = getSet();
            assert.equal(collection.push(), collection);
        });
    });
    describe('reduce method', () => {
        it('should return a single value', () => {
            const array = DEFAULT_PARAM.slice();
            const collection = getSet(array);
            const reducer = (a, b) => (a || 0) + b;
            assert.equal(collection.reduce(reducer), array.reduce(reducer));
        });
        it('should accept a function in the first parameter', () => {
            getSet().reduce(() => true);
        });
        it('should execute the callback for every entry', () => {
            const array = DEFAULT_PARAM.slice();
            const collection = getSet(array);
            let i = 0;
            collection.reduce(() => ++i);
            assert.equal(i, collection.size());
        });
        it('should accept a first-value in the second parameter', () => {
            const compare = {};
            getSet([0]).reduce((a) => assert.equal(a, compare), compare);
        });
        it('should default to NULL as the first value', () => {
            getSet([0]).reduce((a) => assert.isNull(a));
        });
    });
    describe('set method', () => {
        it('should set the given value at the given key', () => {
            const array = DEFAULT_PARAM.slice();
            const collection = getSet(array);
            collection.add('foo');
            assert.equal(collection.size(), array.length + 1);
        });
        it('should return the collection', () => {
            const array = DEFAULT_PARAM.slice();
            const collection = getSet(array);
            assert.equal(collection.add('foo'), collection);
        });
    });
    describe('shift method', () => {
        it('should return the value from the front of the collection', () => {
            const array = DEFAULT_PARAM.slice();
            const collection = getSet(array);
            assert.equal(collection.shift(), array.shift());
        });
        it('should remove the value from the front of the collection', () => {
            const array = DEFAULT_PARAM.slice();
            const collection = getSet(array);
            array.shift();
            collection.shift();
            assert.equal(collection.size(), array.length);
        });
    });
    describe('size method', () => {
        it('should return the number of keys on the value', () => {
            const array = DEFAULT_PARAM.slice();
            const collection = getSet(array);
            assert.equal(collection.size(), array.length);
        });
    });
    describe('unshift method', () => {
        it('should insert a value at the front of the collection', () => {
            const array = [1];
            const collection = getSet(array);
            collection.unshift(0);
            assert.equal(collection.size(), 1 + array.length);
            assert.isTrue(collection.has(0));
        });
        it('should take any number of arguments', () => {
            const array = DEFAULT_PARAM.slice();
            const collection = getSet([]);
            collection.unshift(...array);
            assert.equal(collection.size(), array.length);
        });
        it('should return the collection', () => {
            const array = DEFAULT_PARAM.slice();
            const collection = getSet(array);
            assert.equal(collection.unshift(0), collection);
        });
    });
    describe('values method', () => {
        it('should return a new collection', () => {
            const array = DEFAULT_PARAM.slice();
            const collection = getSet(array);
            const values = collection.values();
            assert.instanceOf(values, RegentSet);
            assert.notEqual(values, collection);
        });
        it(
            'should reset each key in the collection to consecutive integers',
            () => {
                // eslint-disable-next-line
                const object = [ 0, 0, 0, 1, 1, 2, 3 ];
                const collection = getSet(object);
                collection.pop();
                collection.pop();
                collection.pop();
                const values = collection.values();
                let integer = 0;
                values.forEach(
                    (value, index) => assert.equal(index, integer++)
                );
            }
        );
    });
});
