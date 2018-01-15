/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert        = require('regent-js/lib/util/assert');
const Collection    = require('regent-js/lib/support/collection');

const CLASS_NAME    = Collection.name;

const getCollection = (param = {
    bar: 'bar',
    foo: 'foo',
}) => new Collection(param);

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        it('can take no parameters', () => {
            new Collection();
        });
        it('can take an array parameter', () => {
            getCollection([ 'bar', 'foo' ]);
        });
    });
    describe('clear method', () => {
        describe('() signature', () => {
            it('should remove all values', () => {
                const collection = getCollection([ 'bar', 'foo' ]);
                collection.clear();
                assert.equal(collection.size(), 0);
            });
            it('should return the collection', () => {
                const collection = getCollection();
                assert.equal(collection.clear(), collection);
            });
        });
    });
    describe('delete method', () => {
        describe('(<id>) signature', () => {
            it(
                'should return true if an element existed and has been removed',
                () => {
                    const collection = getCollection([ 'bar', 'foo' ]);
                    assert.isTrue(collection.delete(0));
                }
            );
            it(
                'should return false if no element exists at the specified key',
                () => {
                    const collection = getCollection([ 'bar', 'foo' ]);
                    assert.isFalse(collection.delete(collection.size()));
                }
            );
            it('should remove the given key from the collection', () => {
                const collection = getCollection([ 'bar', 'foo' ]);
                collection.delete(0);
                assert.isFalse(collection.has(1));
            });
            it(
                'should not remove the non-given keys from the collection',
                () => {
                    const collection = getCollection([ 'bar', 'foo' ]);
                    collection.delete(collection.size());
                    assert.isTrue(collection.has(0));
                }
            );
        });
    });
    describe('filter method', () => {
        describe('(<function>) signature', () => {
            it(
                'should take a callback function as the first parameter',
                () => {
                    const collection = getCollection([ 'bar', 'foo' ]);
                    collection.filter(() => true);
                }
            );
            it('should execute the callback function for each entry', () => {
                const array = [ 'bar', 'foo' ];
                const collection = getCollection(array);
                let i = 0;
                collection.filter(() => ++i);
                assert.equal(i, Object.keys(array).length);
            });
            it('should return a new collection object', () => {
                const collection = getCollection();
                assert.notEqual(collection.filter(), collection);
                assert.instanceOf(collection.filter(), Collection);
            });
            it('should not remove entries from the current collection', () => {
                const array = [ 'bar', 'foo' ];
                const collection = getCollection(array);
                collection.filter(() => false);
                assert.equal(collection.size(), Object.keys(array).length);
            });
            it(
                'should remove entries where the callback returned false',
                () => {
                    const collection = getCollection([ 'bar', 'foo' ])
                        .filter(() => false);
                    assert.equal(collection.size(), 0);
                }
            );
            it('should retain entries where the callback returned true', () => {
                const array = [ 'bar', 'foo' ];
                const collection = getCollection(array).filter(() => true);
                assert.equal(collection.size(), Object.keys(array).length);
            });
        });
    });
    describe('forEach method', () => {
        describe('(<function>) signature', () => {
            it('should fire a callback for each key/value pair', () => {
                const array = [ 'bar', 'foo' ];
                const collection = getCollection(array);
                let i = 0;
                collection.forEach(() => ++i);
                assert.equal(i, Object.keys(array).length);
            });
            it('should return the collection', () => {
                const collection = getCollection();
                assert.equal(collection.forEach(), collection);
            });
        });
    });
    describe('get method', () => {
        describe('(<id>) signature', () => {
            it('should return the value at a given key if one exists', () => {
                const array = [ 'bar', 'foo' ];
                const collection = getCollection(array);
                assert.equal(collection.get(0), array[0]);
            });
        });
    });
    describe('has method', () => {
        describe('(<id>) signature', () => {
            it('should return true if a value exists at the given key', () => {
                const collection = getCollection([ 'bar', 'foo' ]);
                assert.isTrue(collection.has(0));
            });
            it(
                'should return false if a value does not exist at the key',
                () => {
                    const collection = getCollection([]);
                    assert.isFalse(collection.has(0));
                }
            );
        });
    });
    describe('keys method', () => {
        describe('() signature', () => {
            it('should return an array', () => {
                const collection = getCollection([]);
                assert.isArray(collection.keys());
            });
            it('should return each key in the new collection', () => {
                const array = [ 'bar', 'foo' ];
                const keys = getCollection(array).keys();
                assert.equal(keys.length, Object.keys(array).length);
                keys.forEach((key) => assert.isTrue(array.hasOwnProperty(key)));
            });
        });
    });
    describe('map method', () => {
        describe('(<function>) signature', () => {
            it('should fire a callback for each key/value pair', () => {
                const array = [ 'bar', 'foo' ];
                const collection = getCollection(array);
                let i = 0;
                collection.map(() => ++i);
                assert.equal(i, Object.keys(array).length);
            });
            it('should return a new collection', () => {
                const collection = getCollection();
                assert.notEqual(collection.map(), collection);
            });
            it(
                'should return a collection of values returned from callback',
                () => {
                    const collection = getCollection([ 'bar', 'foo' ]);
                    const mapped = collection.map(() => true);
                    mapped.forEach((value) => assert.equal(value, true));
                }
            );
        });
    });
    describe('pop method', () => {
        describe('() signature', () => {
            it('should return the last item from the collection', () => {
                const array = [ 'bar', 'foo' ];
                const collection = getCollection(array);
                assert.equal(collection.pop(), 'foo');
            });
            it('should remove the last item from the collection', () => {
                const array = [ 'bar', 'foo' ];
                const collection = getCollection(array);
                collection.pop();
                assert.equal(collection.size(), 1);
            });
        });
    });
    describe('push method', () => {
        describe('(<value>) signature', () => {
            it('should append an item to the end of the collection', () => {
                const array = [ 'bar', 'foo' ];
                const collection = getCollection(array);
                collection.push('baz');
                assert.equal(collection.size(), Object.keys(array).length + 1);
            });
            it('should return the collection', () => {
                const collection = getCollection();
                assert.equal(collection.push(), collection);
            });
        });
    });
    describe('reduce method', () => {
        describe('(<function>) signature', () => {
            it('should return a single value', () => {
                const array = [ 'bar', 'foo' ];
                const collection = getCollection(array);
                const reducer = (a, b) => (a || '') + b;
                assert.equal(collection.reduce(reducer), 'barfoo');
            });
            it('should accept a function in the first parameter', () => {
                getCollection().reduce(() => true);
            });
            it('should execute the callback for every entry', () => {
                const array = [ 'bar', 'foo' ];
                const collection = getCollection(array);
                let i = 0;
                collection.reduce(() => ++i);
                assert.equal(i, collection.size());
            });
            it('should accept a first-value in the second parameter', () => {
                const compare = {};
                getCollection(['bar']).reduce(
                    (a) => assert.equal(a, compare),
                    compare
                );
            });
            it(
                'should use a NULL first value if no default is provided',
                () => {
                    getCollection(['bar']).reduce((a) => assert.isNull(a));
                }
            );
        });
    });
    describe('set method', () => {
        describe('(<key>, <value>) signature', () => {
            it('should set the given value at the given key', () => {
                const array = [ 'bar', 'foo' ];
                const collection = getCollection(array);
                collection.set(0, 'baz');
                assert.equal(collection.size(), array.length);
            });
            it('should return the collection', () => {
                const array = [ 'bar', 'foo' ];
                const collection = getCollection(array);
                assert.equal(collection.set(1, 'bar'), collection);
            });
        });
    });
    describe('shift method', () => {
        describe('() signature', () => {
            it(
                'should return the value from the front of the collection',
                () => {
                    const array = ['foo'];
                    const collection = getCollection(array);
                    assert.equal(collection.shift(), 'foo');
                }
            );
            it(
                'should remove the value from the front of the collection',
                () => {
                    const array = [ 'bar', 'foo' ];
                    const collection = getCollection(array);
                    collection.shift();
                    assert.equal(collection.size(), 1);
                }
            );
        });
    });
    describe('size method', () => {
        describe('() signature', () => {
            it('should return the number of keys on the value', () => {
                const array = [ 'bar', 'foo' ];
                const collection = getCollection(array);
                assert.equal(collection.size(), Object.keys(array).length);
            });
        });
    });
    describe('unshift method', () => {
        describe('(<value>) signature', () => {
            it('should insert a value at the front of the collection', () => {
                const array = ['foo'];
                const collection = getCollection(array);
                collection.unshift('bar');
                assert.equal(collection.size(), Object.keys(array).length + 1);
                assert.equal(collection.get(0), 'bar');
            });
            it('should return the collection', () => {
                const array = [ 'bar', 'foo' ];
                const collection = getCollection(array);
                assert.equal(collection.unshift(0), collection);
            });
        });
    });
    describe('values method', () => {
        describe('() signature', () => {
            it('should return an array', () => {
                const array = [ 'bar', 'foo' ];
                const collection = getCollection(array);
                const values = collection.values();
                assert.isArray(values);
                assert.notEqual(values, collection);
            });
            it(
                'should reset each key to consecutive integers',
                () => {
                    const object = [ 'bar', 'foo' ];
                    const collection = getCollection(object);
                    const values = collection.values();
                    let integer = 0;
                    values.forEach(
                        (value, index) => assert.equal(index, integer++)
                    );
                }
            );
        });
    });
    describe('last method', () => {
        describe('() signature', () => {
            it('should return the last element from the collection', () => {
                const array = [ 'foo', 'bar' ];
                const collection = getCollection(array);
                const last = collection.last();
                assert.equal(last, array.pop());
            });
        });
    });
    describe('lastKey method', () => {
        describe('() signature', () => {
            it('should return the last key from the collection', () => {
                const array = [ 'bar', 'foo' ];
                const collection = getCollection(array);
                const lastKey = collection.lastKey();
                assert.equal(lastKey, array.length - 1);
            });
        });
    });
    describe('add method', () => {
        describe('(<value>) signature', () => {
            it('should add a value to the collection', () => {
                const array = [ 'bar', 'foo' ];
                const collection = getCollection(array);
                collection.add('baz');
                assert.equal(collection.get(collection.size() - 1), 'baz');
            });
            it('should return the collection', () => {
                const array = [ 'bar', 'foo' ];
                const collection = getCollection(array);
                assert.equal(collection.add('baz'), collection);
            });
        });
    });
    describe('getOr method', () => {
        describe('(<key>) signature', () => {
            it('should return the value if it is present', () => {
                const collection = getCollection(['foo']);
                assert.equal(collection.getOr(0), 'foo');
            });
            it('should return null if the value is not present', () => {
                const collection = getCollection();
                assert.isNull(collection.getOr(0));
            });
        });
        describe('(<key>, <default>) signature', () => {
            it('should return the value if it is present', () => {
                const collection = getCollection(['foo']);
                assert.equal(collection.getOr(0, 'bar'), 'foo');
            });
            it('should return the default if the value is not present', () => {
                const collection = getCollection();
                assert.equal(collection.getOr(0, 'bar'), 'bar');
            });
        });
    });
    describe('toObject method', () => {
        describe('() signature', () => {
            it('should return an object', () => {
                const collection = getCollection();
                assert.isObject(collection.toObject());
            });
            it('should use the key/value pairs from the collection', () => {
                const array = [ 'foo', 'bar' ];
                const collection = getCollection(array);
                const collectionObject = collection.toObject();
                Object.keys(collectionObject).forEach((key) => {
                    assert.isDefined(array[key]);
                    assert.equal(array[key], collectionObject[key]);
                });
            });
        });
    });
});
