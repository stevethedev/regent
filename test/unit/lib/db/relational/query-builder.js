/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = require('regent-js/lib/util/assert');
const QueryBuilder = require('regent-js/lib/db/relational/query-builder');

const CLASS_NAME   = QueryBuilder.name;
const CONNECTION   = {};
const getQueryBuilder = (connection = CONNECTION, table = 'table') => {
    return new QueryBuilder(connection, table);
};

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        describe('(<connection>, <settings>) signature', () => {
            it('should return a new instance', () => {
                assert.instanceOf(getQueryBuilder(), QueryBuilder);
            });
        });
    });
    describe('SELECT clause', () => {
        describe('distinct method', () => {
            describe('(<enable = true>) signature', () => {
                it('should add the DISTINCT keyword', () => {
                    const query = getQueryBuilder();
                    query.distinct();
                    assert.equal(
                        query.compile().query,
                        'SELECT DISTINCT * FROM table'
                    );
                });
                it(
                    'should remove the DISTINCT keyword if <enable> is false',
                    () => {
                        const query = getQueryBuilder();
                        query.distinct();
                        query.distinct(false);
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table'
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.distinct(), query);
                });
            });
        });
        describe('select method', () => {
            describe('omission', () => {
                it('should add * to the SELECT clause', () =>  {
                    const query = getQueryBuilder();
                    assert.equal(query.compile().query, 'SELECT * FROM table');
                });
            });
            describe('(<field>, ...) signature', () => {
                it('should add <field> to the SELECT clause', () => {
                    const query = getQueryBuilder();
                    query.select('foo');
                    assert.equal(
                        query.compile().query,
                        'SELECT foo FROM table'
                    );
                });
                it('should accept any number of parameters', () => {
                    const query = getQueryBuilder();
                    query.select('foo', 'bar', 'baz');
                    assert.equal(
                        query.compile().query,
                        'SELECT foo, bar, baz FROM table'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.select('foo'), query);
                });
            });
            describe('({ <alias>: <field> }, ...) signature', () => {
                it(
                    'should add "<field> AS <alias>" to the SELECT clause',
                    () => {
                        const query = getQueryBuilder();
                        query.select({
                            'BAR': 'bar',
                            'FOO': 'foo',
                        });
                        assert.equal(
                            query.compile().query,
                            'SELECT bar AS "BAR", foo AS "FOO" FROM table'
                        );
                    }
                );
                it('should accept any number of parameters', () => {
                    const query = getQueryBuilder();
                    query.select({
                        'BAR': 'bar',
                        'FOO': 'foo',
                    }, { 'BAZ': 'baz' });
                    assert.equal(
                        query.compile().query,
                        `SELECT ${[
                            'bar AS "BAR"',
                            'foo AS "FOO"',
                            'baz AS "BAZ"',
                        ].join(', ')} FROM table`
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.select({}), query);
                });
            });
        });
        describe('selectRaw method', () => {
            describe('(<string>) signature', () => {
                it('should add <string> to the SELECT clause', () => {
                    const query = getQueryBuilder();
                    query.selectRaw('foo, bar, baz');
                    assert.equal(
                        query.compile().query,
                        'SELECT foo, bar, baz FROM table'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.selectRaw('*'), query);
                });
            });
        });
    });
    describe('Aggregate Functions', () => {
        describe('avg method', () => {
            describe('(<field>) signature', () => {
                it('should add "avg(<field>)" to the SELECT clause', () => {
                    const query = getQueryBuilder();
                    query.avg('foo');
                    assert.equal(
                        query.compile().query,
                        'SELECT AVG(foo) FROM table'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.avg('foo'), query);
                });
            });
            describe('(<field>, <alias>) signature', () => {
                it(
                    'should add "avg(<field>) as <alias>" to the SELECT clause',
                    () => {
                        const query = getQueryBuilder();
                        query.avg('foo', 'bar');
                        assert.equal(
                            query.compile().query,
                            'SELECT AVG(foo) AS "bar" FROM table'
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.avg('foo', 'bar'), query);
                });
            });
        });
        describe('count method', () => {
            describe('(<field>) signature', () => {
                it('should add "count(<field>)" to the SELECT clause', () => {
                    const query = getQueryBuilder();
                    query.count('foo');
                    assert.equal(
                        query.compile().query,
                        'SELECT COUNT(foo) FROM table'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.count('foo'), query);
                });
            });
            describe('(<field>, <alias>) signature', () => {
                it('should add "[SELECT] count(<field>) as <alias>"', () => {
                    const query = getQueryBuilder();
                    query.count('foo', 'bar');
                    assert.equal(
                        query.compile().query,
                        'SELECT COUNT(foo) AS "bar" FROM table'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.count('foo', 'bar'), query);
                });
            });
        });
        describe('max method', () => {
            describe('(<field>) signature', () => {
                it('should add "max(<field>)" to the SELECT clause', () => {
                    const query = getQueryBuilder();
                    query.max('foo');
                    assert.equal(
                        query.compile().query,
                        'SELECT MAX(foo) FROM table'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.max('foo'), query);
                });
            });
            describe('(<field>, <alias>) signature', () => {
                it(
                    'should add "max(<field>) as <alias>" to the SELECT clause',
                    () => {
                        const query = getQueryBuilder();
                        query.max('foo', 'bar');
                        assert.equal(
                            query.compile().query,
                            'SELECT MAX(foo) AS "bar" FROM table'
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.max('foo', 'bar'), query);
                });
            });
        });
        describe('min method', () => {
            describe('(<field>) signature', () => {
                it('should add "min(<field>)" to the SELECT clause', () => {
                    const query = getQueryBuilder();
                    query.min('foo');
                    assert.equal(
                        query.compile().query,
                        'SELECT MIN(foo) FROM table'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.min('foo'), query);
                });
            });
            describe('(<field>, <alias>) signature', () => {
                it(
                    'should add "min(<field>) as <alias>" to the SELECT clause',
                    () => {
                        const query = getQueryBuilder();
                        query.min('foo', 'bar');
                        assert.equal(
                            query.compile().query,
                            'SELECT MIN(foo) AS "bar" FROM table'
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.min('foo', 'bar'), query);
                });
            });
        });
        describe('sum method', () => {
            describe('(<field>) signature', () => {
                it('should add "sum(<field>)" to the SELECT clause', () => {
                    const query = getQueryBuilder();
                    query.sum('foo');
                    assert.equal(
                        query.compile().query,
                        'SELECT SUM(foo) FROM table'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.sum('foo'), query);
                });
            });
            describe('(<field>, <alias>) signature', () => {
                it(
                    'should add "sum(<field>) as <alias>" to the SELECT clause',
                    () => {
                        const query = getQueryBuilder();
                        query.sum('foo', 'bar');
                        assert.equal(
                            query.compile().query,
                            'SELECT SUM(foo) AS "bar" FROM table'
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.sum('foo', 'bar'), query);
                });
            });
        });
    });
    describe('INSERT INTO <table-name> (...) VALUES (...) clause', () => {
        describe('insert method', () => {
            describe('({ <field>: <value>, ... }) signature', () => {
                it('should send the request', () => {
                    let sent = false;
                    const connection = {
                        send() {
                            sent = true;
                        },
                    };
                    getQueryBuilder(connection).insert({});
                    assert.isTrue(sent);
                });
                it('should add "(<...field>) VALUES (<...value>)', () => {
                    const fields = {
                        'bar': 'my-bar',
                        'foo': 'my-foo',
                    };
                    const connection = {
                        send(query) {
                            assert.equal(
                                query,
                                'INSERT INTO table (bar, foo) VALUES ($1, $2)'
                            );
                        },
                    };
                    getQueryBuilder(connection).insert(fields);
                });
                it('should accept any number of arguments', () => {
                    const fields = [
                        {
                            'bar': 'my-bar',
                            'foo': 'my-foo',
                        },
                        {
                            'bar': 'muh-bar',
                            'foo': 'muh-foo',
                        },
                    ];
                    const connection = {
                        send(query) {
                            assert.equal(
                                query,
                                'INSERT INTO table (bar, foo) VALUES '
                                + '($1, $2), ($3, $4)'
                            );
                        },
                    };
                    getQueryBuilder(connection).insert(...fields);
                });
                it('should add every <value> to the bound arguments', () => {
                    const fields = {
                        'bar': 'my-bar',
                        'foo': 'my-foo',
                    };
                    const connection = {
                        send(query, bind) {
                            assert.equal(
                                bind.length,
                                Object.keys(fields).length
                            );
                        },
                    };
                    getQueryBuilder(connection).insert(fields);
                });
            });
        });
        describe('insertRaw method', () => {
            describe('(<signature>, <bound[]>) signature', () => {
                it('should send the request', () => {
                    let sent = false;
                    const connection = {
                        send() {
                            sent = true;
                        },
                    };
                    getQueryBuilder(connection, '<table>').insertRaw(
                        '(foo, bar) VALUES ($1, $2), ($3, $4)',
                        [
                            'foo',
                            'bar',
                            'my-foo',
                            'my-bar',
                        ]
                    );
                    assert.isTrue(sent);
                });
                it(
                    'should add "(<...field>) VALUES (<...value>), ... to the '
                    + 'INSERT clause',
                    () => {
                        const connection = {
                            send(query) {
                                assert.equal(
                                    query,
                                    'INSERT INTO <table> (foo, bar) VALUES '
                                    + '($1, $2), ($3, $4)');
                            },
                        };
                        getQueryBuilder(connection, '<table>').insertRaw(
                            '(foo, bar) VALUES ($1, $2), ($3, $4)',
                            [
                                'my-foo',
                                'my-bar',
                                'muh-foo',
                                'muh-bar',
                            ]
                        );
                    }
                );
                it('should add every <value> to the bound arguments', () => {
                    const bound = [
                        'my-foo',
                        'my-bar',
                        'muh-foo',
                        'muh-bar',
                    ];
                    const connection = {
                        send(query, bind) {
                            assert.equal(bind.length, bound.length);
                        },
                    };
                    getQueryBuilder(connection, '<table>').insertRaw(
                        '(foo, bar) VALUES ($1, $2), ($3, $4)',
                        bound
                    );
                });
            });
        });
    });
    describe('UPDATE <table-name> SET clause', () => {
        describe('decrement method', () => {
            describe('(<decr-field>, <decr-value = 1>, { <field>: <value>, } = '
                + '{}) signature', () => {
                it('should send the request', () => {
                    let sent = false;
                    const connection = {
                        send() {
                            sent = true;
                        },
                    };
                    const query = getQueryBuilder(connection);
                    query.decrement('decr', 1, { 'field': 'my-foo' });
                    assert.isTrue(sent);
                });
                it('should set the SET clause to include "<decr-field> = '
                    + '<decr-field> - <decr-value>"', () => {
                    const connection = {
                        send(query) {
                            assert.equal(
                                query,
                                'UPDATE table SET decr = decr - $1'
                            );
                        },
                    };
                    const query = getQueryBuilder(connection);
                    query.decrement('decr');
                });
                it('should set the SET clause to include "<field> = <value>" '
                    + 'for each key/value pair', () => {
                    const connection = {
                        send(query) {
                            assert.equal(
                                query,
                                'UPDATE table SET decr = decr - $1, field = $2'
                            );
                        },
                    };
                    const query = getQueryBuilder(connection);
                    query.decrement('decr', 1, { 'field': 'my-foo' });
                });
                it('should add all of the <value> and <incr-value> values to '
                    + 'the bound arguments', () => {
                    const attributes = { 'field': 'my-foo' };
                    const connection = {
                        send(query, bind) {
                            assert.equal(
                                bind.length,
                                Object.keys(attributes).length + 1
                            );
                        },
                    };
                    const query = getQueryBuilder(connection);
                    query.decrement('decr', 1, attributes);
                });
            });
            describe('({ <incr-field>: <incr-value>, }, { <field>: <value>, } '
                + '= {}) signature', () => {
                it('should send the request', () => {
                    let sent = false;
                    const connection = {
                        send() {
                            sent = true;
                        },
                    };
                    const query = getQueryBuilder(connection);
                    query.decrement({
                        'bar': 2,
                        'foo': 1,
                    }, { 'field': 'my-foo' });
                    assert.isTrue(sent);
                });
                it(
                    'should set the SET clause to include "<incr-field> = '
                    + '<incr-field> + <incr-value>" for each key/value pair',
                    () => {
                        const connection = {
                            send(query) {
                                assert.equal(
                                    query,
                                    'UPDATE table SET bar = bar - $1, '
                                    + 'foo = foo - $2'
                                );
                            },
                        };
                        const query = getQueryBuilder(connection);
                        query.decrement({
                            'bar': 2,
                            'foo': 1,
                        });
                    }
                );
                it('should set the SET clause to include "<field> = <value>" '
                    + 'for each key/value pair', () => {
                    const connection = {
                        send(query) {
                            assert.equal(
                                query,
                                'UPDATE table SET bar = bar - $1, '
                                + 'foo = foo - $2, field = $3'
                            );
                        },
                    };
                    const query = getQueryBuilder(connection);
                    query.decrement({
                        'bar': 2,
                        'foo': 1,
                    }, { 'field': 'my-foo' });
                });
                it('should add all of the <value> and <incr-value> values to '
                    + 'the bound arguments', () => {
                    const decrements = {
                        'bar': 2,
                        'foo': 1,
                    };
                    const values = { 'field': 'my-foo' };
                    const connection = {
                        send(query, bind) {
                            assert.equal(
                                bind.length,
                                Object.keys(decrements).length
                                + Object.keys(values).length
                            );
                        },
                    };
                    const query = getQueryBuilder(connection);
                    query.decrement(decrements, values);
                });
            });
        });
        describe('increment method', () => {
            describe('(<incr-field>, <incr-value = 1>, { <field>: <value>, } = '
                + '{}) signature', () => {
                it('should send the request', () => {
                    let sent = false;
                    const connection = {
                        send() {
                            sent = true;
                        },
                    };
                    const query = getQueryBuilder(connection);
                    query.increment('incr');
                    assert.isTrue(sent);
                });
                it('should set the SET clause to include "<incr-field> = '
                    + '<incr-field> + <incr-value>"', () => {
                    const connection = {
                        send(query) {
                            assert.equal(
                                query,
                                'UPDATE table SET incr = incr + $1'
                            );
                        },
                    };
                    const query = getQueryBuilder(connection);
                    query.increment('incr');
                });
                it('should set the SET clause to include "<field> = <value>" '
                    + 'for each key/value pair', () => {
                    const connection = {
                        send(query) {
                            assert.equal(
                                query,
                                'UPDATE table SET incr = incr + $1, foo = $2'
                            );
                        },
                    };
                    const query = getQueryBuilder(connection);
                    query.increment('incr', 1, { 'foo': 'foo' });
                });
                it('should add all of the <value> and <incr-value> values to '
                    + 'the bound arguments', () => {
                    const values = { 'foo': 'foo' };
                    const connection = {
                        send(query, bind) {
                            assert.equal(
                                bind.length,
                                Object.keys(values).length + 1
                            );
                        },
                    };
                    const query = getQueryBuilder(connection);
                    query.increment('incr', 1, values);
                });
                it('should prefer overwrites to the increment', () => {
                    const values = { 'foo': 'foo' };
                    const connection = {
                        send(query) {
                            assert.equal(
                                query,
                                'UPDATE table SET foo = $1'
                            );
                        },
                    };
                    const query = getQueryBuilder(connection);
                    query.increment('foo', 1, values);
                });
            });
            describe('({ <incr-field>: <incr-value>, }, { <field>: <value>, } '
                + '= {}) signature', () => {
                it('should send the request', () => {
                    let sent = false;
                    const connection = {
                        send() {
                            sent = true;
                        },
                    };
                    const query = getQueryBuilder(connection);
                    query.increment({
                        'bar': 2,
                        'foo': 1,
                    }, { 'field': 'my-foo' });
                    assert.isTrue(sent);
                });
                it(
                    'should set the SET clause to include "<incr-field> = '
                    + '<incr-field> + <incr-value>" for each key/value pair',
                    () => {
                        const connection = {
                            send(query) {
                                assert.equal(
                                    query,
                                    'UPDATE table SET bar = bar + $1, '
                                    + 'foo = foo + $2'
                                );
                            },
                        };
                        const query = getQueryBuilder(connection);
                        query.increment({
                            'bar': 2,
                            'foo': 1,
                        });
                    }
                );
                it('should set the SET clause to include "<field> = <value>" '
                    + 'for each key/value pair', () => {
                    const connection = {
                        send(query) {
                            assert.equal(
                                query,
                                'UPDATE <table> SET bar = bar + $1, '
                                + 'foo = foo + $2, field = $3'
                            );
                        },
                    };
                    const query = getQueryBuilder(connection, '<table>');
                    query.increment({
                        'bar': 2,
                        'foo': 1,
                    }, { 'field': 'my-foo' });
                });
                it('should add all of the <value> and <incr-value> values to '
                    + 'the bound arguments', () => {
                    const increments = {
                        'bar': 2,
                        'foo': 1,
                    };
                    const values = { 'field': 'my-foo' };
                    const connection = {
                        send(query, bind) {
                            assert.equal(
                                bind.length,
                                Object.keys(increments).length
                                + Object.keys(values).length
                            );
                        },
                    };
                    const query = getQueryBuilder(connection, '<table>');
                    query.decrement(increments, values);
                });
            });
        });
        describe('update method', () => {
            describe('({ <field>: <value>, ... }) signature', () => {
                it('should send the request', () => {
                    let wasSent = false;
                    const connection = {
                        send() {
                            wasSent = true;
                        },
                    };
                    const query = getQueryBuilder(connection);
                    query.update({ foo: true });
                    assert.isTrue(wasSent);
                });
                it('should set the SET clause to "<field> = <value>" for each '
                    + 'key/value pair', () => {
                    const connection = {
                        send(query) {
                            assert.equal(query, 'UPDATE table SET foo = $1');
                        },
                    };
                    const query = getQueryBuilder(connection);
                    query.update({ foo: true });
                });
                it('should add each <value> to the bound arguments', () => {
                    const connection = {
                        send(query, bind) {
                            assert.equal(bind.length, 1);
                        },
                    };
                    const query = getQueryBuilder(connection);
                    query.update({ foo: true });
                });
            });
        });
        describe('updateRaw method', () => {
            describe('(<signature>, <values[]>) signature', () => {
                it('should send the request', () => {
                    let wasSent = false;
                    const connection = {
                        send() {
                            wasSent = true;
                        },
                    };
                    const query = getQueryBuilder(connection);
                    query.updateRaw('foo = $1', ['my-foo']);
                    assert.isTrue(wasSent);
                });
                it('should set the SET clause to "<signature>"', () => {
                    const connection = {
                        send(query) {
                            assert.equal(
                                query,
                                'UPDATE table SET foo = $1, bar = $2'
                            );
                        },
                    };
                    const query = getQueryBuilder(connection);
                    query.updateRaw(
                        'foo = $1, bar = $2',
                        [ 'my-foo', 'my-bar' ]
                    );
                });
                it('should add each <...values> to the bound arguments', () => {
                    const values = [ 'my-foo', 'my-bar' ];
                    const connection = {
                        send(query, bind) {
                            assert.equal(bind.length, values.length);
                        },
                    };
                    const query = getQueryBuilder(connection);
                    query.updateRaw(
                        'foo = $1, bar = $2',
                        values
                    );
                });
            });
        });
    });
    describe('DELETE clause', () => {
        describe('delete method', () => {
            describe('() signature', () => {
                it('should send the request', () => {
                    let isSent = false;
                    const connection = {
                        send() {
                            isSent = true;
                        },
                    };
                    getQueryBuilder(connection).delete();
                    assert.isTrue(isSent);
                });
                it('should send DELETE FROM <table>', () => {
                    const connection = {
                        send(query) {
                            assert.equal(
                                query,
                                'DELETE FROM table'
                            );
                        },
                    };
                    getQueryBuilder(connection).delete();
                });
            });
        });
    });
    describe('TRUNCATE clause', () => {
        describe('truncate method', () => {
            describe('(options = {}) signature', () => {
                it('should send the request', () => {
                    let sent = false;
                    const connection = {
                        send() {
                            sent = true;
                        },
                    };
                    const query = getQueryBuilder(connection);
                    query.truncate();
                    assert.isTrue(sent);
                });
                it('should use the format TRUNCATE <table>', () => {
                    const connection = {
                        send(query) {
                            assert.equal(
                                query,
                                'TRUNCATE TABLE table',
                            );
                        },
                    };
                    const query = getQueryBuilder(connection);
                    query.truncate();
                });
                it('should cascade if options.cascade === true', () => {
                    const connection = {
                        send(query) {
                            assert.equal(
                                query,
                                'TRUNCATE TABLE table CASCADE'
                            );
                        },
                    };
                    const query = getQueryBuilder(connection);
                    query.truncate({ cascade: true });
                });
            });
        });
    });
    describe('FROM clause', () => {
        describe('from method', () => {
            describe('(<table>) signature', () => {
                it('should set the FROM clause to "<table>"', () => {
                    const query = getQueryBuilder();
                    query.from('table');
                    assert.equal(query.compile().query, 'SELECT * FROM table');
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.from('table'), query);
                });
            });
            describe('(<table>, <alias>) signature', () => {
                it('should set the FROM clause to "<table> AS <alias>"', () => {
                    const query = getQueryBuilder();
                    query.from('table', 'alias');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table AS "alias"'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.from('table', 'alias'), query);
                });
            });
        });
        describe('fromRaw method', () => {
            describe('(<signature>) signature', () => {
                it('should set the FROM clause to "<signature>"', () => {
                    const query = getQueryBuilder();
                    query.fromRaw('"table" AS "alias"');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM "table" AS "alias"'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.fromRaw('"table" AS "alias"'), query);
                });
            });
        });
    });
    describe('JOIN clauses', () => {
        describe('crossJoin method', () => {
            describe('(<table>) signature', () => {
                it('should add "CROSS JOIN <table>" to the query', () => {
                    const query = getQueryBuilder();
                    query.crossJoin('foreign_table');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table CROSS JOIN foreign_table'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.crossJoin('foreign_table'),
                        query
                    );
                });
            });
            describe('({ <alias>: <table> }) signature', () => {
                it(
                    'should add "CROSS JOIN <table> AS <alias>" to the query',
                    () => {
                        const query = getQueryBuilder();
                        query.crossJoin({ 'my_alias': 'foreign_table' });
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table CROSS JOIN foreign_table '
                                + 'AS "my_alias"'
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.crossJoin({ 'my_alias': 'foreign_table' }),
                        query
                    );
                });
            });
        });
        describe('crossJoinRaw method', () => {
            describe('(<definition>) signature', () => {
                it('should add "CROSS JOIN <definition>" to the query', () => {
                    const query = getQueryBuilder();
                    query.crossJoinRaw(
                        'foreign_table'
                    );
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table CROSS JOIN foreign_table'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.crossJoinRaw('foreign_table'),
                        query
                    );
                });
            });
        });
        describe('join method', () => {
            describe('(<table>, <key-name>) signature', () => {
                it(
                    'should add "INNER JOIN <table> ON <table>.<key-name> = '
                    + '<this.table>.<key-name>" to the query',
                    () => {
                        const query = getQueryBuilder();
                        query.join('foreign_table', 'shared_key');
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table INNER JOIN foreign_table ON '
                                + 'foreign_table.shared_key = table.shared_key'
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.join('foreign_table', 'shared_key'),
                        query
                    );
                });
            });
            describe('({ <alias>: <table> }, <key-name>) signature', () => {
                it(
                    'should add "INNER JOIN <table> AS <alias> ON '
                    + '<alias>.<key-name> = <this.table>.<key-name>" to '
                    + 'the query',
                    () => {
                        const query = getQueryBuilder();
                        const table = 'foreign_table';
                        const alias = 'my_table';
                        query.join({ [alias]: table }, 'shared_key');
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table '
                                + 'INNER JOIN foreign_table AS "my_table" '
                                + 'ON "my_table".shared_key = table.shared_key'
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.join({ 'my_table': 'foreign_table' }, 'sharekey'),
                        query
                    );
                });
            });
            describe('(<table>, <local-key>, <remote-key>) signature', () => {
                it(
                    'should add "INNER JOIN <table> ON <table>.<remote-key> = '
                    + '<this.table>.<local-key>" to the query',
                    () => {
                        const query = getQueryBuilder();
                        query.join('foreign_table', 'local', 'foreign');
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table '
                                + 'INNER JOIN foreign_table '
                                + 'ON foreign_table.foreign = table.local'
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.join('foreign_table', 'local', 'foreign'),
                        query
                    );
                });
            });
            describe(
                '({ <alias>: <table> }, <local-key>, <operation>, <remote-key>',
                () => {
                    it(
                        'should add "INNER JOIN <table> AS <alias> ON <alias>.'
                            + '<remote-key> = <this.table>.<local-key>" to '
                            + 'the query',
                        () => {
                            const query = getQueryBuilder();
                            query.join(
                                { alias: 'foreign_table' },
                                'local',
                                '=',
                                'foreign',
                            );
                            assert.equal(
                                query.compile().query,
                                'SELECT * FROM table '
                                    + 'INNER JOIN foreign_table AS "alias" '
                                    + 'ON "alias".foreign = table.local'
                            );
                        }
                    );
                    it('should return the Query Builder', () => {
                        const query = getQueryBuilder();
                        query.join(
                            query.join(
                                { alias: 'foreign_table' },
                                'local',
                                '=',
                                'foreign',
                            ),
                            query
                        );
                    });
                }
            );
            describe(
                '(<table>, <local-key>, <operation>, <remote-key>) signature',
                () => {
                    it(
                        'should add "INNER JOIN <table> ON <table>.<remote-key>'
                        + ' <operation> <this.table>.<local-key>" to the query',
                        () => {
                            const query = getQueryBuilder();
                            query.join(
                                'foreign_table',
                                'local',
                                '=',
                                'foreign',
                            );
                            assert.equal(
                                query.compile().query,
                                'SELECT * FROM table '
                                    + 'INNER JOIN foreign_table '
                                    + 'ON foreign_table.foreign = table.local'
                            );
                        }
                    );
                    it('should return the Query Builder', () => {
                        const query = getQueryBuilder();
                        assert.equal(
                            query.join(
                                'foreign_table',
                                'local',
                                '=',
                                'foreign',
                            ),
                            query
                        );
                    });
                }
            );
            describe(
                '({ <alias>: <table> }, <local-key>, <operation>, <remote-key>)'
                + ' signature',
                () => {
                    it(
                        'should add "INNER JOIN <table> AS <alias> ON '
                            + '<alias>.<remote-key> <operation> '
                            + '<this.table>.<local-key>" to the query',
                        () => {
                            const query = getQueryBuilder();
                            query.join(
                                { alias: 'foreign_table' },
                                'local',
                                '=',
                                'foreign',
                            );
                            assert.equal(
                                query.compile().query,
                                'SELECT * FROM table '
                                    + 'INNER JOIN foreign_table AS "alias" '
                                    + 'ON "alias".foreign = table.local'
                            );
                        }
                    );
                    it('should return the Query Builder', () => {
                        const query = getQueryBuilder();
                        assert.equal(
                            query.join(
                                { alias: 'foreign_table' },
                                'local',
                                '=',
                                'foreign',
                            ),
                            query
                        );
                    });
                }
            );
        });
        describe('joinRaw method', () => {
            describe('(<definition>, <bind = []>) signature', () => {
                it('should add "INNER JOIN <definition>" to the query', () => {
                    const query = getQueryBuilder();
                    query.joinRaw(
                        'foreign_table ON foreign_table.foo = table.foo '
                            + 'AND foreign_table.bar = {0}',
                        ['my-bar']
                    );
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table INNER JOIN foreign_table '
                            + 'ON foreign_table.foo = table.foo '
                            + 'AND foreign_table.bar = $1'
                    );
                });
                it('should add <...bind> to the bound arguments', () => {
                    const query = getQueryBuilder();
                    query.joinRaw(
                        'foreign_table ON foreign_table.foo = table.foo '
                            + 'AND foreign_table.bar = {0}',
                        ['my-bar']
                    );
                    assert.equal(
                        query.compile().bound[0],
                        'my-bar'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.joinRaw(
                            'foreign_table ON foreign_table.foo = table.foo'
                        ),
                        query
                    );
                });
            });
        });
        describe('leftJoin method', () => {
            describe('(<table>, <key-name>) signature', () => {
                it(
                    'should add "LEFT JOIN <table> ON <table>.<key-name> = '
                        + '<this.table>.<key-name>" to the query',
                    () => {
                        const query = getQueryBuilder();
                        query.leftJoin('foreign_table', 'shared_key');
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table LEFT JOIN foreign_table ON '
                                + 'foreign_table.shared_key = table.shared_key'
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.leftJoin('foreign_table', 'shared_key'),
                        query,
                    );
                });
            });
            describe('({ <alias>: <table> }, <key-name>) signature', () => {
                it(
                    'should add "LEFT JOIN <table> AS <alias> ON '
                        + '<alias>.<key-name> = <this.table>.<key-name>" to '
                        + 'the query',
                    () => {
                        const query = getQueryBuilder();
                        query.leftJoin(
                            { alias: 'foreign_table' },
                            'shared_key'
                        );
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table LEFT JOIN '
                                + 'foreign_table AS "alias" ON '
                                + '"alias".shared_key = table.shared_key'
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.leftJoin({ alias: 'foreign_table' }, 'skey'),
                        query,
                    );
                });
            });
            describe('(<table>, <local-key>, <remote-key>) signature', () => {
                it(
                    'should add "LEFT JOIN <table> ON <table>.<remote-key> = '
                        + '<this.table>.<local-key>" to the query',
                    () => {
                        const query = getQueryBuilder();
                        query.leftJoin(
                            { alias: 'foreign_table' },
                            'local_key',
                            'foreign_key'
                        );
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table '
                                + 'LEFT JOIN foreign_table AS "alias" ON '
                                + '"alias".foreign_key = table.local_key'
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.leftJoin(
                            { alias: 'foreign_table' },
                            'local_key',
                            'foreign_key',
                        ),
                        query,
                    );
                });
            });
            describe(
                '({ <alias>: <table> }, <local-key>, <operation>, <remote-key>',
                () => {
                    it(
                        'should add "LEFT JOIN <table> AS <alias> ON '
                            + '<alias>.<remote-key> = <this.table>.<local-key>"'
                            + ' to the query',
                        () => {
                            const query = getQueryBuilder();
                            query.leftJoin(
                                { alias: 'foreign_table' },
                                'local_key',
                                '<>',
                                'remote_key',
                            );
                            assert.equal(
                                query.compile().query,
                                'SELECT * FROM table '
                                    + 'LEFT JOIN foreign_table AS "alias" ON '
                                    + '"alias".remote_key <> table.local_key'
                            );
                        }
                    );
                    it('should return the Query Builder', () => {
                        const query = getQueryBuilder();
                        assert.equal(
                            query.leftJoin(
                                { alias: 'foreign_table' },
                                'local_key',
                                '<>',
                                'remote_key',
                            ),
                            query,
                        );
                    });
                }
            );
            describe(
                '(<table>, <local-key>, <operation>, <remote-key>) signature',
                () => {
                    it(
                        'should add "LEFT JOIN <table> ON <table>.<remote-key> '
                        + '<operation> <this.table>.<local-key>" to the query',
                        () => {
                            const query = getQueryBuilder();
                            query.leftJoin(
                                'remote_table',
                                'local_key',
                                '<>',
                                'remote_key',
                            );
                            assert.equal(
                                query.compile().query,
                                'SELECT * FROM table '
                                    + 'LEFT JOIN remote_table ON '
                                    + 'remote_table.remote_key <> '
                                    + 'table.local_key'
                            );
                        }
                    );
                    it('should return the Query Builder', () => {
                        const query = getQueryBuilder();
                        assert.equal(
                            query.leftJoin(
                                'remote_table',
                                'local_key',
                                '<>',
                                'remote_key',
                            ),
                            query,
                        );
                    });
                }
            );
            describe(
                '({ <alias>: <table> }, <local-key>, <operation>, <remote-key>)'
                + ' signature',
                () => {
                    it(
                        'should add "LEFT JOIN <table> AS <alias> ON '
                            + '<alias>.<remote-key> <operation> '
                            + '<this.table>.<local-key>" to the query',
                        () => {
                            const query = getQueryBuilder();
                            query.leftJoin(
                                { alias: 'remote_table' },
                                'local_key',
                                '<>',
                                'remote_key',
                            );
                            assert.equal(
                                query.compile().query,
                                'SELECT * FROM table '
                                    + 'LEFT JOIN remote_table AS "alias" ON '
                                    + '"alias".remote_key <> table.local_key'
                            );
                        }
                    );
                    it('should return the Query Builder', () => {
                        const query = getQueryBuilder();
                        assert.equal(
                            query.leftJoin(
                                { alias: 'remote_table' },
                                'local_key',
                                '<>',
                                'remote_key',
                            ),
                            query,
                        );
                    });
                }
            );
        });
        describe('leftJoinRaw method', () => {
            describe('(<signature>, <bind = []>) signature', () => {
                it('should add "LEFT JOIN <signature>" to the query', () => {
                    const query = getQueryBuilder();
                    query.leftJoinRaw(
                        'foreign_table ON foreign_table.foo = table.bar AND '
                            + 'foreign_table.baz = {0}',
                        ['my-baz']
                    );
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table LEFT JOIN foreign_table '
                            + 'ON foreign_table.foo = table.bar '
                            + 'AND foreign_table.baz = $1'
                    );
                });
                it('should add <...bind> to the bound arguments', () => {
                    const query = getQueryBuilder();
                    query.leftJoinRaw(
                        'foreign_table ON foreign_table.foo = table.bar '
                            + 'AND foreign_table.baz = {0}',
                        ['my-baz']
                    );
                    assert.equal(
                        query.compile().bound[0],
                        'my-baz'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.leftJoinRaw(
                            'foreign_table ON foreign_table.foo = table.bar'
                        ),
                        query
                    );
                });
            });
        });
        describe('rightJoin method', () => {
            describe('(<table>, <key-name>) signature', () => {
                it(
                    'should add "RIGHT JOIN <table> ON <table>.<key-name> = '
                        + '<this.table>.<key-name>" to the query',
                    () => {
                        const query = getQueryBuilder();
                        query.rightJoin('foreign_table', 'shared_key');
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table RIGHT JOIN foreign_table ON '
                                + 'foreign_table.shared_key = table.shared_key'
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.rightJoin('foreign_table', 'shared_key'),
                        query,
                    );
                });
            });
            describe('({ <alias>: <table> }, <key-name>) signature', () => {
                it(
                    'should add "RIGHT JOIN <table> AS <alias> ON '
                        + '<alias>.<key-name> = <this.table>.<key-name>" to '
                        + 'the query',
                    () => {
                        const query = getQueryBuilder();
                        query.rightJoin(
                            { alias: 'foreign_table' },
                            'shared_key'
                        );
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table '
                                + 'RIGHT JOIN foreign_table AS "alias" ON '
                                + '"alias".shared_key = table.shared_key'
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.rightJoin(
                            { alias: 'foreign_table' },
                            'shared_key'
                        ),
                        query,
                    );
                });
            });
            describe('(<table>, <local-key>, <remote-key>) signature', () => {
                it(
                    'should add "RIGHT JOIN <table> ON <table>.<remote-key> = '
                        + '<this.table>.<local-key>" to the query',
                    () => {
                        const query = getQueryBuilder();
                        query.rightJoin(
                            'foreign_table',
                            'local_key',
                            'remote_key',
                        );
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table '
                                + 'RIGHT JOIN foreign_table ON '
                                + 'foreign_table.remote_key = table.local_key'
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.rightJoin(
                            'foreign_table',
                            'local_key',
                            'remote_key'
                        ),
                        query,
                    );
                });
            });
            describe(
                '({ <alias>: <table> }, <local-key>, <operation>, <remote-key>',
                () => {
                    it(
                        'should add "RIGHT JOIN <table> AS <alias> ON '
                            + '<alias>.<remote-key> <operation> '
                            + '<this.table>.<local-key>" to the query',
                        () => {
                            const query = getQueryBuilder();
                            query.rightJoin(
                                { alias: 'foreign_table' },
                                'local_key',
                                '<>',
                                'remote_key',
                            );
                            assert.equal(
                                query.compile().query,
                                'SELECT * FROM table '
                                    + 'RIGHT JOIN foreign_table AS "alias" ON '
                                    + '"alias".remote_key <> table.local_key'
                            );
                        }
                    );
                    it('should return the Query Builder', () => {
                        const query = getQueryBuilder();
                        assert.equal(
                            query.rightJoin(
                                { alias: 'foreign_table' },
                                'local_key',
                                '<>',
                                'remote_key',
                            ),
                            query,
                        );
                    });
                }
            );
            describe(
                '(<table>, <local-key>, <operation>, <remote-key>) signature',
                () => {
                    it(
                        'should add "RIGHT JOIN <table> ON <table>.<remote-key>'
                            + ' <operation> <this.table>.<local-key>" '
                            + 'to the query',
                        () => {
                            const query = getQueryBuilder();
                            query.rightJoin(
                                'foreign_table',
                                'local_key',
                                '<>',
                                'remote_key',
                            );
                            assert.equal(
                                query.compile().query,
                                'SELECT * FROM table '
                                    + 'RIGHT JOIN foreign_table ON '
                                    + 'foreign_table.remote_key <> '
                                    + 'table.local_key'
                            );
                        }
                    );
                    it('should return the Query Builder', () => {
                        const query = getQueryBuilder();
                        assert.equal(
                            query.rightJoin(
                                'remote_table',
                                'local_key',
                                '<>',
                                'remote_key',
                            ),
                            query,
                        );
                    });
                }
            );
        });
        describe('rightJoinRaw method', () => {
            describe('(<signature>, <bind = []>) signature', () => {
                it('should add "RIGHT JOIN <signature>" to the query', () => {
                    const query = getQueryBuilder();
                    query.rightJoinRaw(
                        'foreign_table ON foreign_table.foo = table.foo '
                            + 'AND foreign_table.bar = {0}',
                        ['my-bar']
                    );
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table RIGHT JOIN foreign_table '
                            + 'ON foreign_table.foo = table.foo '
                            + 'AND foreign_table.bar = $1'
                    );
                });
                it('should add <...bind> to the bound arguments', () => {
                    const query = getQueryBuilder();
                    query.rightJoinRaw(
                        'foreign_table ON foreign_table.foo = table.foo '
                            + 'AND foreign_table.bar = {0}',
                        ['my-bar']
                    );
                    assert.equal(
                        query.compile().bound[0],
                        'my-bar'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.rightJoinRaw(
                            'foreign_table ON foreign_table.foo = table.foo '
                                + 'AND foreign_table.bar = {0}',
                            ['my-bar']
                        ),
                        query
                    );
                });
            });
        });
    });
    describe('WHERE clause', () => {
        describe('orWhere method', () => {
            describe('(<field>, <value>) signature', () => {
                it(
                    'should set WHERE <field> = <value> on SELECT queries',
                    () => {
                        const query = getQueryBuilder();
                        query.where('foo', 'bar').orWhere('bar', 'baz');
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table WHERE foo = $1 OR bar = $2'
                        );
                    }
                );
                it(
                    'should set WHERE <field> = <value> on UPDATE queries',
                    () => {
                        const connection = {
                            send(query) {
                                assert.equal(
                                    query,
                                    'UPDATE table WHERE foo = $1 OR bar = $2'
                                );
                            },
                        };
                        getQueryBuilder(connection)
                            .where('foo', 'bar')
                            .orWhere('bar', 'baz')
                            .update();
                    }
                );
                it(
                    'should set WHERE <field> = <value> on DELETE queries',
                    () => {
                        const connection = {
                            send(query) {
                                assert.equal(
                                    query,
                                    'DELETE FROM table WHERE foo = $1 '
                                    + 'OR bar = $2'
                                );
                            },
                        };
                        getQueryBuilder(connection)
                            .where('foo', 'bar')
                            .orWhere('bar', 'baz')
                            .delete();
                    }
                );
                it(
                    'should add <value> to bound arguments on SELECT queries',
                    () => {
                        const query = getQueryBuilder();
                        let i = 0;
                        ++i && query.where('foo', 'bar');
                        ++i && query.orWhere('bar', 'baz');
                        assert.equal(query.compile().bound.length, i);
                    }
                );
                it(
                    'should add <value> to bound arguments on UPDATE queries',
                    () => {
                        let i = 0;
                        const connection = {
                            send(query, bound) {
                                assert.equal(bound.length, i);
                            },
                        };
                        const query = getQueryBuilder(connection);
                        ++i && query.where('foo', 'bar');
                        ++i && query.orWhere('bar', 'baz');
                        query.update();
                    }
                );
                it(
                    'should add <value> to bound arguments on DELETE queries',
                    () => {
                        let i = 0;
                        const connection = {
                            send(query, bound) {
                                assert.equal(bound.length, i);
                            },
                        };
                        const query = getQueryBuilder(connection);
                        ++i && query.where('foo', 'bar');
                        ++i && query.orWhere('bar', 'baz');
                        query.delete();
                    }
                );
                it('should join conditionals with ... OR ...', () => {
                    const query = getQueryBuilder();
                    query.where('foo', 'bar').orWhere('bar', 'baz');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table WHERE foo = $1 OR bar = $2'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    query.where('foo', 'bar');
                    assert.equal(query.orWhere('foo', 'baz'), query);
                });
            });
            describe('(<field>, <operator>, <value>) signature', () => {
                it(
                    'should set WHERE ... <field> <operator> <value> on '
                    + 'SELECT queries',
                    () => {
                        const query = getQueryBuilder();
                        query.where('foo', 'bar').orWhere('foo', '!=', 'baz');
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table WHERE foo = $1 OR foo != $2'
                        );
                    }
                );
                it(
                    'should set WHERE ... <field> <operator> <value> on '
                    + 'UPDATE queries',
                    () => {
                        const connection = {
                            send(query) {
                                assert.equal(
                                    query,
                                    'UPDATE table WHERE foo = $1 OR foo != $2'
                                );
                            },
                        };
                        getQueryBuilder(connection)
                            .where('foo', 'bar')
                            .orWhere('foo', '!=', 'baz')
                            .update();
                    }
                );
                it(
                    'should set WHERE ... <field> <operator> <value> on '
                    + 'DELETE queries',
                    () => {
                        const connection = {
                            send(query) {
                                assert.equal(
                                    query,
                                    'DELETE FROM table WHERE foo = $1 OR '
                                    + 'foo != $2'
                                );
                            },
                        };
                        getQueryBuilder(connection)
                            .where('foo', 'bar')
                            .orWhere('foo', '!=', 'baz')
                            .delete();
                    }
                );
                it(
                    'should add <value> to bound arguments on SELECT queries',
                    () => {
                        const query = getQueryBuilder();
                        let i = 0;
                        ++i && query.where('foo', 'bar');
                        ++i && query.orWhere('foo', '!=', 'baz');
                        assert.equal(query.compile().bound.length, i);
                    }
                );
                it(
                    'should add <value> to bound arguments on UPDATE queries',
                    () => {
                        let i = 0;
                        const connection = {
                            send(query, bound) {
                                assert.equal(bound.length, i);
                            },
                        };
                        const query = getQueryBuilder(connection);
                        ++i && query.where('foo', 'bar');
                        ++i && query.orWhere('foo', '!=', 'baz');
                        query.update();
                    }
                );
                it(
                    'should add <value> to bound arguments on DELETE queries',
                    () => {
                        let i = 0;
                        const connection = {
                            send(query, bound) {
                                assert.equal(bound.length, i);
                            },
                        };
                        const query = getQueryBuilder(connection);
                        ++i && query.where('foo', 'bar');
                        ++i && query.orWhere('foo', '!=', 'baz');
                        query.delete();
                    }
                );
                it('should join conditionals with ... OR ...', () => {
                    const query = getQueryBuilder();
                    query.where('foo', 'bar').orWhere('foo', '!=', 'bar');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table WHERE foo = $1 OR foo != $2'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.orWhere('foo', '!=', 'bar'), query);
                });
            });
        });
        describe('orWhereRaw method', () => {
            describe('(<conditional>, <bind = []>) signature', () => {
                it(
                    'should set WHERE ... <conditional> on SELECT queries',
                    () => {
                        const query = getQueryBuilder();
                        query.where('foo', 'bar');
                        query.orWhereRaw('foo = {0}', ['baz']);
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table WHERE foo = $1 OR foo = $2'
                        );
                    }
                );
                it(
                    'should set WHERE ... <conditional> on UPDATE queries',
                    () => {
                        const connection = {
                            send(query) {
                                assert.equal(
                                    query,
                                    'UPDATE table WHERE foo = $1 OR foo = $2'
                                );
                            },
                        };
                        getQueryBuilder(connection)
                            .where('foo', 'bar')
                            .orWhereRaw('foo = {0}', ['baz'])
                            .update();
                    }
                );
                it(
                    'should set WHERE ... <conditional> on DELETE queries',
                    () => {
                        const connection = {
                            send(query) {
                                assert.equal(
                                    query,
                                    'DELETE FROM table WHERE foo = $1 OR '
                                    + 'foo = $2'
                                );
                            },
                        };
                        getQueryBuilder(connection)
                            .where('foo', 'bar')
                            .orWhereRaw('foo = {0}', ['baz'])
                            .delete();
                    }
                );
                it(
                    'should add <...bind> to bound arguments on SELECT queries',
                    () => {
                        let i = 0;
                        const query = getQueryBuilder();
                        ++i && query.where('foo', 'bar');
                        ++i && query.orWhereRaw('foo = {0}', ['baz']);
                        assert.equal(query.compile().bound.length, i);
                    }
                );
                it(
                    'should add <...bind> to bound arguments on UPDATE queries',
                    () => {
                        let i = 0;
                        const connection = {
                            send(query, bound) {
                                assert.equal(bound.length, i);
                            },
                        };
                        const query = getQueryBuilder(connection);
                        ++i && query.where('foo', 'bar');
                        ++i && query.orWhereRaw('foo = {0}', ['baz']);
                        query.update();
                    }
                );
                it(
                    'should add <...bind> to bound arguments on DELETE queries',
                    () => {
                        let i = 0;
                        const connection = {
                            send(query, bound) {
                                assert.equal(bound.length, i);
                            },
                        };
                        const query = getQueryBuilder(connection);
                        ++i && query.where('foo', 'bar');
                        ++i && query.orWhereRaw('foo = {0}', ['baz']);
                        query.delete();
                    }
                );
                it('should join conditionals with ... OR ...', () => {
                    const query = getQueryBuilder();
                    query.where('foo', 'bar').orWhereRaw('foo = {0}', ['baz']);
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table WHERE foo = $1 OR foo = $2'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.orWhereRaw('foo = {0}', ['foo']), query);
                });
            });
        });
        describe('where method', () => {
            describe('(<field>, <value>) signature', () => {
                it(
                    'should set WHERE ... <field> = <value> on SELECT queries',
                    () => {
                        assert.equal(
                            getQueryBuilder().where('foo', 'bar')
                                .compile().query,
                            'SELECT * FROM table WHERE foo = $1'
                        );
                    }
                );
                it(
                    'should set WHERE ... <field> = <value> on UPDATE queries',
                    () => {
                        const connection = {
                            send(query) {
                                assert.equal(
                                    query,
                                    'UPDATE table WHERE foo = $1'
                                );
                            },
                        };
                        getQueryBuilder(connection).where('foo', 'bar')
                            .update();
                    }
                );
                it(
                    'should set WHERE ... <field> = <value> on DELETE queries',
                    () => {
                        const connection = {
                            send(query) {
                                assert.equal(
                                    query,
                                    'DELETE FROM table WHERE foo = $1'
                                );
                            },
                        };
                        getQueryBuilder(connection).where('foo', 'bar')
                            .delete();
                    }
                );
                it(
                    'should add <value> to bound arguments on SELECT queries',
                    () => {
                        assert.equal(
                            getQueryBuilder().where('foo', 'bar')
                                .compile().bound.length,
                            1
                        );
                    }
                );
                it(
                    'should add <value> to bound arguments on UPDATE queries',
                    () => {
                        const connection = {
                            send(query, bound) {
                                assert.equal(bound.length, 1);
                            },
                        };
                        getQueryBuilder(connection).where('foo', 'bar')
                            .update();
                    }
                );
                it(
                    'should add <value> to bound arguments on DELETE queries',
                    () => {
                        const connection = {
                            send(query, bound) {
                                assert.equal(bound.length, 1);
                            },
                        };
                        getQueryBuilder(connection).where('foo', 'bar')
                            .delete();
                    }
                );
                it('should join conditionals with ... AND ...', () => {
                    const query = getQueryBuilder();
                    query.where('foo', 'my-foo');
                    query.where('bar', 'my-bar');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table WHERE foo = $1 AND bar = $2'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.where('foo', 'bar'), query);
                });
            });
            describe('(<field>, <operator>, <value>) signature', () => {
                it(
                    'should set WHERE ... <field> <operator> <value> on '
                    + 'SELECT queries',
                    () => {
                        const query = getQueryBuilder();
                        query.where('foo', '<=', 'bar');
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table WHERE foo <= $1'
                        );
                    }
                );
                it(
                    'should set WHERE ... <field> <operator> <value> on '
                    + 'UPDATE queries',
                    () => {
                        const connection = {
                            send(query) {
                                assert.equal(
                                    query,
                                    'UPDATE table WHERE foo <= $1'
                                );
                            },
                        };
                        const query = getQueryBuilder(connection);
                        query.where('foo', '<=', 'bar');
                        query.update();
                    }
                );
                it(
                    'should set WHERE ... <field> <operator> <value> on '
                    + 'DELETE queries',
                    () => {
                        const connection = {
                            send(query) {
                                assert.equal(
                                    query,
                                    'DELETE FROM table WHERE foo <= $1'
                                );
                            },
                        };
                        const query = getQueryBuilder(connection);
                        query.where('foo', '<=', 'bar');
                        query.delete();
                    }
                );
                it(
                    'should add <value> to bound arguments on SELECT queries',
                    () => {
                        const query = getQueryBuilder();
                        query.where('foo', '<=', 'bar');
                        assert.equal(query.compile().bound.length, 1);
                    }
                );
                it(
                    'should add <value> to bound arguments on UPDATE queries',
                    () => {
                        const connection = {
                            send(query, bound) {
                                assert.equal(bound.length, 1);
                            },
                        };
                        const query = getQueryBuilder(connection);
                        query.where('foo', '<=', 'bar');
                        query.update();
                    }
                );
                it(
                    'should add <value> to bound arguments on DELETE queries',
                    () => {
                        const connection = {
                            send(query, bound) {
                                assert.equal(bound.length, 1);
                            },
                        };
                        const query = getQueryBuilder(connection);
                        query.where('foo', '<=', 'bar');
                        query.delete();
                    }
                );
                it('should join conditionals with ... AND ...', () => {
                    const query = getQueryBuilder();
                    query.where('foo', '<=', 'my-foo');
                    query.where('bar', '<=', 'my-bar');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table WHERE foo <= $1 AND bar <= $2'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.where('foo', '<=', 'bar'), query);
                });
            });
        });
        describe('whereBetween method', () => {
            describe(
                '(<field>, [<x>, <y>], <inclusive = true>) signature',
                () => {
                    it(
                        'should add "<field> >= <x>" and "<field> <= <y>" to '
                        + 'the WHERE clause if <inclusive> is true',
                        () => {
                            const query = getQueryBuilder();
                            query.whereBetween('foo', [ 0, 1 ]);
                            assert.equal(
                                query.compile().query,
                                'SELECT * FROM table WHERE '
                                    + 'foo >= $1 AND foo <= $2'
                            );
                        }
                    );
                    it(
                        'should add "<field> > <x>" and "<field> < <y>" to '
                        + 'the WHERE clause if <inclusive> is true',
                        () => {
                            const query = getQueryBuilder();
                            query.whereBetween('foo', [ 0, 1 ], false);
                            assert.equal(
                                query.compile().query,
                                'SELECT * FROM table WHERE '
                                    + 'foo > $1 AND foo < $2'
                            );
                        }
                    );
                    it('should join conditionals with ... AND ...', () => {
                        const query = getQueryBuilder();
                        query.where('foo', 1);
                        query.whereBetween('bar', [ 0, 1 ], true);
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table WHERE '
                                + 'foo = $1 AND bar >= $2 AND bar <= $3'
                        );
                    });
                    it('should return the Query Builder', () => {
                        const query = getQueryBuilder();
                        assert.equal(
                            query.whereBetween('bar', [ 0, 1 ], true),
                            query
                        );
                    });
                }
            );
        });
        describe('whereColumn method', () => {
            describe('(<field-1>, <field-2>) signature', () => {
                it(
                    'should add "<field-1> = <field-2>" to the WHERE clause',
                    () => {
                        const query = getQueryBuilder();
                        query.whereColumn('foo', 'bar');
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table WHERE foo = bar'
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.whereColumn('foo', 'bar'),
                        query
                    );
                });
            });
            describe('(<field-1>, <operator>, <field-2>) signature', () => {
                it(
                    'should add "<field-1> <operator> <field-2>" to the '
                    + 'WHERE clause',
                    () => {
                        const query = getQueryBuilder();
                        query.whereColumn('foo', '<', 'bar');
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table WHERE foo < bar'
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.whereColumn('foo', '<', 'bar'),
                        query
                    );
                });
            });
        });
        describe('whereDate method', () => {
            describe('(<field>, <date>) signature', () => {
                it('should add "<field> = <date>" to the WHERE clause', () => {
                    const query = getQueryBuilder();
                    query.whereDate('foo', new Date());
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table WHERE foo = $1'
                    );
                });
                it('should add <date> to the bound arguments', () => {
                    const date = new Date();
                    const query = getQueryBuilder();
                    query.whereDate('foo', date);
                    assert.equal(
                        query.compile().bound[0],
                        date
                    );
                });
                it('should return the Query Builder', () => {
                    const date = new Date();
                    const query = getQueryBuilder();
                    assert.equal(
                        query.whereDate('foo', date),
                        query
                    );
                });
            });
            describe('(<field>, <operator>, <date>) signature', () => {
                it('should add "<field> <operator> <date>"', () => {
                    const date = new Date();
                    const query = getQueryBuilder();
                    query.whereDate('foo', '<', date);
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table WHERE foo < $1'
                    );
                });
                it('should add <date> to the bound arguments', () => {
                    const date = new Date();
                    const query = getQueryBuilder();
                    query.whereDate('foo', '<', date);
                    assert.equal(
                        query.compile().bound[0],
                        date
                    );
                });
                it('should return the Query Builder', () => {
                    const date = new Date();
                    const query = getQueryBuilder();
                    assert.equal(
                        query.whereDate('foo', '<', date),
                        query
                    );
                });
            });
        });
        describe('whereDay method', () => {
            describe('(<field>, <day>) signature', () => {
                it(
                    'should add "DAY(<field>) = <day>" to the WHERE clause',
                    () => {
                        const query = getQueryBuilder();
                        query.whereDay('foo', 1);
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table WHERE DAY(foo) = $1'
                        );
                    }
                );
                it('should add <day> to the bound arguments', () => {
                    const date = new Date();
                    const query = getQueryBuilder();
                    query.whereDay('foo', date.getDate());
                    assert.equal(
                        query.compile().bound[0],
                        date.getDate()
                    );
                });
                it(
                    'should accept a Date object for the <day> field and '
                    + 'extract the appropriate day',
                    () => {
                        const date = new Date();
                        const query = getQueryBuilder();
                        query.whereDay('foo', date);
                        assert.equal(
                            query.compile().bound[0],
                            date.getDate()
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const date = new Date();
                    const query = getQueryBuilder();
                    assert.equal(
                        query.whereDay('foo', date.getDate()),
                        query
                    );
                });
            });
            describe('(<field>, <operator>, <day>) signature', () => {
                it('should add "DAY(<field>) <operator> <day>"', () => {
                    const date = new Date();
                    const query = getQueryBuilder();
                    query.whereDay('foo', '<', date.getDate());
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table WHERE DAY(foo) < $1'
                    );
                });
                it('should add <day> to the bound arguments', () => {
                    const date = new Date();
                    const query = getQueryBuilder();
                    query.whereDay('foo', '<', date.getDate());
                    assert.equal(
                        query.compile().bound[0],
                        date.getDate()
                    );
                });
                it(
                    'should accept a Date object for the <day> field and '
                    + 'extract the appropriate day',
                    () => {
                        const date = new Date();
                        const query = getQueryBuilder();
                        query.whereDay('foo', '<', date);
                        assert.equal(
                            query.compile().bound[0],
                            date.getDate()
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const date = new Date();
                    const query = getQueryBuilder();
                    assert.equal(
                        query.whereDay('foo', '<', date.getDate()),
                        query
                    );
                });
            });
        });
        describe('whereExists method', () => {
            describe(`(<query:${CLASS_NAME}>) signature`, () => {
                it('should add "EXISTS (<query>) to the WHERE clause', () => {
                    const innerQuery = getQueryBuilder();
                    const outerQuery = getQueryBuilder();

                    innerQuery.where('foo', 'my-foo');
                    outerQuery.where('bar', 'my-bar');
                    outerQuery.whereExists(innerQuery);

                    assert.equal(
                        outerQuery.compile().query,
                        'SELECT * FROM table WHERE bar = $1 AND '
                            + 'EXISTS (SELECT * FROM table WHERE foo = $2)'
                    );
                });
                it('should return the Query Builder', () => {
                    const innerQuery = getQueryBuilder();
                    const outerQuery = getQueryBuilder();

                    assert.equal(
                        outerQuery.whereExists(innerQuery),
                        outerQuery
                    );
                });
            });
        });
        describe('whereExistsRaw method', () => {
            describe('(<query:string>, <bind = []>) signature', () => {
                it('should add "EXISTS (<query>) to the WHERE clause', () => {
                    const query = getQueryBuilder();
                    query.where('foo', 'my-foo');
                    query.whereExistsRaw(
                        'SELECT * FROM my_table WHERE bar = {0}',
                        ['my-bar']
                    );
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table WHERE foo = $1 AND '
                            + 'EXISTS (SELECT * FROM my_table WHERE bar = $2)'
                    );
                });
                it('should add <...bind> to the bound arguments', () => {
                    const query = getQueryBuilder();
                    query.where('foo', 'my-foo');
                    query.whereExistsRaw(
                        'SELECT * FROM my_table WHERE bar = {0}',
                        ['my-bar']
                    );
                    const { bound } = query.compile();
                    assert.equal(bound[0], 'my-foo');
                    assert.equal(bound[1], 'my-bar');
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.whereExistsRaw('SELECT * FROM my_table'),
                        query
                    );
                });
            });
        });
        describe('whereIn method', () => {
            describe('(<field>, <values = []>) signature', () => {
                it(
                    'should add "<field> IN (<...values>)" to the WHERE clause',
                    () => {
                        const query = getQueryBuilder();
                        query.whereIn('foo', [ '1', '2' ]);
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table WHERE foo IN ($1, $2)'
                        );
                    }
                );
                it('should add <...values> to the bound arguments', () => {
                    const query = getQueryBuilder();
                    const array = [ '1', '2' ];
                    query.whereIn('foo', array);
                    assert.equal(
                        query.compile().bound.length,
                        array.length
                    );
                });
                it(
                    'should use "<field> IS NULL" if a blank array is passed',
                    () => {
                        const query = getQueryBuilder();
                        query.whereIn('foo', []);
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table WHERE foo IS NULL'
                        );
                    }
                );
                it(
                    'should throw an error if a non-array value is passed',
                    () => {
                        const query = getQueryBuilder();
                        assert.throws(() => query.whereIn('foo', false));
                    }
                );
                it('should join conditionals with ... AND ...', () => {
                    const query = getQueryBuilder();
                    query.where('foo', 'my-foo');
                    query.whereIn('bar', [ '1', '2' ]);
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table WHERE foo = $1 AND bar IN ($2, $3)'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.whereIn('foo', [ 0, 1 ]),
                        query
                    );
                });
            });
        });
        describe('whereMonth method', () => {
            describe('(<field>, <month>) signature', () => {
                it(
                    'should add "MONTH(<field>) = <month>" to the WHERE clause',
                    () => {
                        const date = new Date();
                        const query = getQueryBuilder();
                        query.whereMonth('foo', date.getMonth() + 1);
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table WHERE MONTH(foo) = $1'
                        );
                    }
                );
                it('should add <month> to the bound arguments', () => {
                    const date = new Date();
                    const query = getQueryBuilder();
                    query.whereMonth('foo', date.getMonth() + 1);
                    assert.equal(
                        query.compile().bound[0],
                        date.getMonth() + 1
                    );
                });
                it(
                    'should accept a Date object for the <month> field and '
                    + 'extract the appropriate month',
                    () => {
                        const date = new Date();
                        const query = getQueryBuilder();
                        query.whereMonth('foo', date);
                        assert.equal(
                            query.compile().bound[0],
                            date.getMonth() + 1
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const date = new Date();
                    const query = getQueryBuilder();
                    assert.equal(
                        query.whereMonth('foo', date),
                        query
                    );
                });
            });
            describe('(<field>, <operator>, <month>) signature', () => {
                it('should add "MONTH(<field>) <operator> <month>"', () => {
                    const date = new Date();
                    const query = getQueryBuilder();
                    query.whereMonth('foo', '<', date.getMonth() + 1);
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table WHERE MONTH(foo) < $1'
                    );
                });
                it('should add <month> to the bound arguments', () => {
                    const date = new Date();
                    const query = getQueryBuilder();
                    query.whereMonth('foo', '<', date.getMonth() + 1);
                    assert.equal(
                        query.compile().bound[0],
                        date.getMonth() + 1
                    );
                });
                it(
                    'should accept a Date object for the <month> field and '
                    + 'extract the appropriate month',
                    () => {
                        const date = new Date();
                        const query = getQueryBuilder();
                        query.whereMonth('foo', '<', date);

                        assert.equal(
                            query.compile().bound[0],
                            date.getMonth() + 1
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const date = new Date();
                    const query = getQueryBuilder();
                    assert.equal(
                        query.whereMonth('foo', '<', date),
                        query
                    );
                });
            });
        });
        describe('whereNotBetween method', () => {
            describe(
                '(<field>, [<x>, <y>], <inclusive = true>) signature',
                () => {
                    it(
                        'should add "<x> > <field> OR <field> > <y>" to the '
                            + 'WHERE clause if <inclusive> is true',
                        () => {
                            const query = getQueryBuilder();
                            query.whereNotBetween('foo', [ 0, 1 ], true);
                            assert.equal(
                                query.compile().query,
                                'SELECT * FROM table WHERE '
                                     + '(foo < $1 OR foo > $2)'
                            );
                        }
                    );
                    it(
                        'should add "<field> <= <x> OR <field> >= <y>" to the '
                            + 'WHERE clause if <inclusive> is false',
                        () => {
                            const query = getQueryBuilder();
                            query.whereNotBetween('foo', [ 0, 1 ], false);
                            assert.equal(
                                query.compile().query,
                                'SELECT * FROM table WHERE '
                                    + '(foo <= $1 OR foo >= $2)'
                            );
                        }
                    );
                    it('should join conditionals with ... AND ...', () => {
                        const query = getQueryBuilder();
                        query.where('foo', 1);
                        query.whereNotBetween('bar', [ 0, 1 ]);
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table WHERE foo = $1 AND '
                                + '(bar < $2 OR bar > $3)'
                        );
                    });
                    it('should return the Query Builder', () => {
                        const query = getQueryBuilder();
                        assert.equal(
                            query.whereNotBetween('foo', [ 0, 1 ]),
                            query
                        );
                    });
                }
            );
        });
        describe('whereNotIn method', () => {
            describe('(<field>, <values = []>) signature', () => {
                it('should add "<field> NOT IN (<...values>)"', () => {
                    const query = getQueryBuilder();
                    query.whereNotIn('foo', [ 0, 1 ]);
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table WHERE foo NOT IN ($1, $2)'
                    );
                });
                it('should add <...values> to the bound arguments', () => {
                    const query = getQueryBuilder();
                    const array = [ 0, 1 ];
                    query.whereNotIn('foo', array);
                    assert.equal(
                        query.compile().bound.length,
                        array.length
                    );
                });
                it('should use "<field> IS NOT NULL" if [] is passed', () => {
                    const query = getQueryBuilder();
                    query.whereNotIn('foo', []);
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table WHERE foo IS NOT NULL'
                    );
                });
                it(
                    'should throw an error if a non-array value is passed',
                    () => {
                        const query = getQueryBuilder();
                        assert.throws(() => query.whereNotIn('foo', true));
                    }
                );
                it('should join conditionals with ... AND ...', () => {
                    const query = getQueryBuilder();
                    query.where('foo', true);
                    query.whereNotIn('bar', [ 0, 1 ]);
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table WHERE foo = $1 AND '
                            + 'bar NOT IN ($2, $3)'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.whereNotIn('foo', [ 0, 1 ]),
                        query
                    );
                });
            });
        });
        describe('whereNull method', () => {
            describe('(<field>, ...) signature', () => {
                it(
                    'should add "<field> IS NULL" to the WHERE clause for '
                    + 'each <field>',
                    () => {
                        const query = getQueryBuilder();
                        query.whereNull('foo');
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table WHERE foo IS NULL'
                        );
                    }
                );
                it('should join conditionals with ... AND ...', () => {
                    const query = getQueryBuilder();
                    query.whereNull('foo');
                    query.whereNull('bar');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table WHERE foo IS NULL AND bar IS NULL'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.whereNull('foo'),
                        query
                    );
                });
            });
        });
        describe('whereNotNull method', () => {
            describe('(<field>, ...) signature', () => {
                it(
                    'should add "<field> IS NOT NULL" to the WHERE clause for '
                    + 'each <field>',
                    () => {
                        const query = getQueryBuilder();
                        query.whereNotNull('foo');
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table WHERE foo IS NOT NULL'
                        );
                    }
                );
                it('should join conditionals with ... AND ...', () => {
                    const query = getQueryBuilder();
                    query.whereNotNull('foo');
                    query.whereNotNull('bar');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table WHERE foo IS NOT NULL '
                            + 'AND bar IS NOT NULL'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.whereNotNull('foo'),
                        query
                    );
                });
            });
        });
        describe('whereRaw method', () => {
            describe('(<conditional>, <bind = []>) signature', () => {
                it(
                    'should set WHERE ... <conditional> on SELECT queries',
                    () => {
                        const query = getQueryBuilder();
                        assert.equal(
                            query.whereRaw('foo is null').compile().query,
                            'SELECT * FROM table WHERE foo is null'
                        );
                    }
                );
                it(
                    'should set WHERE ... <conditional> on UPDATE queries',
                    () => {
                        const connection = {
                            send(query) {
                                assert.equal(
                                    query,
                                    'UPDATE table WHERE foo is null'
                                );
                            },
                        };
                        getQueryBuilder(connection)
                            .whereRaw('foo is null')
                            .update();
                    }
                );
                it(
                    'should set WHERE ... <conditional> on DELETE queries',
                    () => {
                        const connection = {
                            send(query) {
                                assert.equal(
                                    query,
                                    'DELETE FROM table WHERE foo is null'
                                );
                            },
                        };
                        getQueryBuilder(connection)
                            .whereRaw('foo is null')
                            .delete();
                    }
                );
                it(
                    'should add <...bind> to the bound arguments on '
                    + 'SELECT queries',
                    () => {
                        assert.equal(
                            getQueryBuilder().whereRaw('foo = {0}', [1])
                                .compile().bound.length,
                            1
                        );
                    }
                );
                it(
                    'should add <...bind> to bound arguments on UPDATE queries',
                    () => {
                        const connection = {
                            send(query, bound) {
                                assert.equal(bound.length, 1);
                            },
                        };
                        getQueryBuilder(connection)
                            .whereRaw('foo = {0}', [1])
                            .update();
                    }
                );
                it(
                    'should add <...bind> to bound arguments on DELETE queries',
                    () => {
                        const connection = {
                            send(query, bound) {
                                assert.equal(bound.length, 1);
                            },
                        };
                        getQueryBuilder(connection).whereRaw('foo = {0}', [1])
                            .delete();
                    }
                );
                it('should join conditionals with ... AND ...', () => {
                    const query = getQueryBuilder();
                    query.whereRaw('foo is null').whereRaw('bar is null');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table WHERE foo is null AND bar is null'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.whereRaw('foo is null'), query);
                });
            });
        });
        describe('whereYear method', () => {
            describe('(<field>, <year>) signature', () => {
                it(
                    'should add "YEAR(<field>) = <year>" to the WHERE clause',
                    () => {
                        const date = new Date();
                        const query = getQueryBuilder();
                        query.whereYear('foo', date.getFullYear());
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table WHERE YEAR(foo) = $1'
                        );
                    }
                );
                it('should add <year> to the bound arguments', () => {
                    const date = new Date();
                    const query = getQueryBuilder();
                    query.whereYear('foo', date.getFullYear());
                    assert.equal(
                        query.compile().bound[0],
                        date.getFullYear()
                    );
                });
                it(
                    'should accept a Date object for the <year> field and '
                    + 'extract the appropriate year',
                    () => {
                        const date = new Date();
                        const query = getQueryBuilder();
                        query.whereYear('foo', date);
                        assert.equal(
                            query.compile().bound[0],
                            date.getFullYear()
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const date = new Date();
                    const query = getQueryBuilder();
                    assert.equal(
                        query.whereYear('foo', date.getFullYear()),
                        query
                    );
                });
            });
            describe('(<field>, <operator>, <year>) signature', () => {
                it('should add "YEAR(<field>) <operator> <year>"', () => {
                    const date = new Date();
                    const query = getQueryBuilder();
                    query.whereYear('foo', '<', date.getFullYear());
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table WHERE YEAR(foo) < $1'
                    );
                });
                it('should add <year> to the bound arguments', () => {
                    const date = new Date();
                    const query = getQueryBuilder();
                    query.whereYear('foo', '<', date.getFullYear());
                    assert.equal(
                        query.compile().bound[0],
                        date.getFullYear()
                    );
                });
                it(
                    'should accept a Date object for the <year> field and '
                    + 'extract the appropriate year',
                    () => {
                        const date = new Date();
                        const query = getQueryBuilder();
                        query.whereYear('foo', '<', date);
                        assert.equal(
                            query.compile().bound[0],
                            date.getFullYear()
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const date = new Date();
                    const query = getQueryBuilder();
                    assert.equal(
                        query.whereYear('foo', '<', date.getFullYear()),
                        query
                    );
                });
            });
        });
    });
    describe('GROUP BY clause', () => {
        describe('groupBy method', () => {
            describe('(<field>, ...) signature', () => {
                it(
                    'should add "<field>" to the GROUP BY clause for '
                    + 'each <field>',
                    () => {
                        const query = getQueryBuilder();
                        query.groupBy('foo', 'bar');
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table GROUP BY foo, bar'
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.groupBy('foo', 'bar'),
                        query
                    );
                });
            });
        });
        describe('groupByRaw method', () => {
            describe('(<signature>) signature', () => {
                it('should add "<signature>" to the GROUP BY clause', () => {
                    const query = getQueryBuilder();
                    query.groupByRaw('foo');
                    query.groupByRaw('bar');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table GROUP BY foo, bar'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.groupByRaw('foo'),
                        query
                    );
                });
            });
        });
    });
    describe('HAVING clause', () => {
        describe('having method', () => {
            describe('(<field>, <value>) signature', () => {
                it('should not render if no GROUP BY is present', () => {
                    const query = getQueryBuilder();
                    query.having('foo', 'bar');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table',
                    );
                });
                it(
                    'should not add <value> to the bound arguments if no '
                        + 'GROUP BY is present',
                    () => {
                        const query = getQueryBuilder();
                        query.having('foo', 'bar');
                        assert.equal(query.compile().bound.length, 0);
                    }
                );
                it(
                    'should set HAVING ... <field> = <value> on the query',
                    () => {
                        const query = getQueryBuilder();
                        query.groupBy('foo');
                        query.having('foo', 'bar');
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table GROUP BY foo HAVING foo = $1',
                        );
                    }
                );
                it('should add <value> to the bound arguments', () => {
                    const query = getQueryBuilder();
                    query.groupBy('foo');
                    query.having('foo', 'bar');
                    assert.equal(query.compile().bound[0], 'bar');
                });
                it('should join conditionals with ... AND ...', () => {
                    const query = getQueryBuilder();
                    query.groupBy('foo');
                    query.having('foo', 'bar');
                    query.having('foo', 'baz');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table GROUP BY foo HAVING '
                            + 'foo = $1 AND foo = $2',
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.having('foo', 'bar'), query);
                });
            });
            describe('(<field>, <operator>, <value>) signature', () => {
                it('should not render if no GROUP BY is present', () => {
                    const query = getQueryBuilder();
                    query.having('foo', '<', 'bar');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table',
                    );
                });
                it(
                    'should not add <value> to the bound arguments if no '
                        + 'GROUP BY is present',
                    () => {
                        const query = getQueryBuilder();
                        query.having('foo', '<', 'bar');
                        assert.equal(query.compile().bound.length, 0);
                    }
                );
                it('should set HAVING ... <field> <operator> <value>', () => {
                    const query = getQueryBuilder();
                    query.groupBy('foo');
                    query.having('foo', '<', 'bar');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table GROUP BY foo HAVING foo < $1',
                    );
                });
                it('should add <value> to the bound arguments', () => {
                    const query = getQueryBuilder();
                    query.groupBy('foo');
                    query.having('foo', '<', 'bar');
                    assert.equal(query.compile().bound[0], 'bar');
                });
                it('should join conditionals with ... AND ...', () => {
                    const query = getQueryBuilder();
                    query.groupBy('foo');
                    query.having('foo', '<', 'bar');
                    query.having('foo', '>', 'baz');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table GROUP BY foo HAVING '
                            + 'foo < $1 AND foo > $2',
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.having('foo', '<', 'bar'), query);
                });
            });
        });
        describe('havingRaw method', () => {
            describe('(<signature>, <bind = []>) signature', () => {
                it('should not render if no GROUP BY is present', () => {
                    const query = getQueryBuilder();
                    query.havingRaw('foo < {0}', ['bar']);
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table',
                    );
                });
                it(
                    'should not add <value> to the bound arguments if no '
                        + 'GROUP BY is present',
                    () => {
                        const query = getQueryBuilder();
                        query.havingRaw('foo < {0}', ['bar']);
                        assert.equal(query.compile().bound.length, 0);
                    }
                );
                it(
                    'should set HAVING ... <signature> on the query',
                    () => {
                        const query = getQueryBuilder();
                        query.groupBy('foo');
                        query.havingRaw('foo < {0}', ['bar']);
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table GROUP BY foo HAVING foo < $1',
                        );
                    }
                );
                it('should add <...bind> to the bound arguments', () => {
                    const query = getQueryBuilder();
                    query.groupBy('foo');
                    query.havingRaw('foo < {0}', ['bar']);
                    assert.equal(query.compile().bound[0], 'bar');
                });
                it('should join conditionals with ... AND ...', () => {
                    const query = getQueryBuilder();
                    query.groupBy('foo');
                    query.havingRaw('foo < {0}', ['bar']);
                    query.havingRaw('foo > {0}', ['baz']);
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table GROUP BY foo HAVING '
                            + 'foo < $1 AND foo > $2',
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.havingRaw('foo < {0}', ['bar']), query);
                });
            });
        });
        describe('orHaving method', () => {
            describe('(<field>, <value>) signature', () => {
                it('should not render if no GROUP BY is present', () => {
                    const query = getQueryBuilder();
                    query.having('foo', 'bar');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table',
                    );
                });
                it(
                    'should not add <value> to the bound arguments if no '
                        + 'GROUP BY is present',
                    () => {
                        const query = getQueryBuilder();
                        query.orHaving('foo', 'bar');
                        assert.equal(query.compile().bound.length, 0);
                    }
                );
                it(
                    'should set HAVING ... <field> = <value> on the query',
                    () => {
                        const query = getQueryBuilder();
                        query.groupBy('foo');
                        query.orHaving('foo', 'bar');
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table GROUP BY foo HAVING foo = $1',
                        );
                    }
                );
                it('should add <value> to the bound arguments', () => {
                    const query = getQueryBuilder();
                    query.groupBy('foo');
                    query.orHaving('foo', 'bar');
                    assert.equal(query.compile().bound[0], 'bar');
                });
                it('should join conditionals with ... OR ...', () => {
                    const query = getQueryBuilder();
                    query.groupBy('foo');
                    query.orHaving('foo', 'bar');
                    query.orHaving('foo', 'baz');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table GROUP BY foo HAVING '
                            + 'foo = $1 OR foo = $2',
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.orHaving('foo', 'bar'), query);
                });
            });
            describe('(<field>, <operator>, <value>) signature', () => {
                it('should not render if no GROUP BY is present', () => {
                    const query = getQueryBuilder();
                    query.orHaving('foo', '<', 'bar');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table',
                    );
                });
                it(
                    'should not add <value> to the bound arguments if no '
                        + 'GROUP BY is present',
                    () => {
                        const query = getQueryBuilder();
                        query.orHaving('foo', '<', 'bar');
                        assert.equal(query.compile().bound.length, 0);
                    }
                );
                it('should set HAVING ... <field> <operator> <value>', () => {
                    const query = getQueryBuilder();
                    query.groupBy('foo');
                    query.orHaving('foo', '<', 'bar');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table GROUP BY foo HAVING foo < $1',
                    );
                });
                it('should add <value> to the bound arguments', () => {
                    const query = getQueryBuilder();
                    query.groupBy('foo');
                    query.orHaving('foo', '<', 'bar');
                    assert.equal(query.compile().bound[0], 'bar');
                });
                it('should join conditionals with ... OR ...', () => {
                    const query = getQueryBuilder();
                    query.groupBy('foo');
                    query.orHaving('foo', '<', 'bar');
                    query.orHaving('foo', '>', 'baz');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table GROUP BY foo HAVING '
                            + 'foo < $1 OR foo > $2',
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.orHaving('foo', '<', 'bar'), query);
                });
            });
        });
        describe('orHavingRaw method', () => {
            describe('(<condition>, <bind = []> signature', () => {
                it('should not render if no GROUP BY is present', () => {
                    const query = getQueryBuilder();
                    query.orHavingRaw('foo < {0}', ['bar']);
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table',
                    );
                });
                it(
                    'should not add <value> to the bound arguments if no '
                        + 'GROUP BY is present',
                    () => {
                        const query = getQueryBuilder();
                        query.orHavingRaw('foo < {0}', ['bar']);
                        assert.equal(query.compile().bound.length, 0);
                    }
                );
                it(
                    'should set HAVING ... <signature> on the query',
                    () => {
                        const query = getQueryBuilder();
                        query.groupBy('foo');
                        query.orHavingRaw('foo < {0}', ['bar']);
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table GROUP BY foo HAVING foo < $1',
                        );
                    }
                );
                it('should add <...bind> to the bound arguments', () => {
                    const query = getQueryBuilder();
                    query.groupBy('foo');
                    query.orHavingRaw('foo < {0}', ['bar']);
                    assert.equal(query.compile().bound[0], 'bar');
                });
                it('should join conditionals with ... OR ...', () => {
                    const query = getQueryBuilder();
                    query.groupBy('foo');
                    query.orHavingRaw('foo < {0}', ['bar']);
                    query.orHavingRaw('foo > {0}', ['baz']);
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table GROUP BY foo HAVING '
                            + 'foo < $1 OR foo > $2',
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.orHavingRaw('foo < {0}', ['bar']),
                        query,
                    );
                });
            });
        });
    });
    describe('UNION clause', () => {
        describe('union method', () => {
            describe(`(${CLASS_NAME}) signature`, () => {
                it(`should add the ${CLASS_NAME} to the UNION clause`, () => {
                    const subquery = getQueryBuilder(CONNECTION, 'fake_table');
                    const query = getQueryBuilder();
                    query.union(subquery);
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table UNION SELECT * FROM fake_table'
                    );
                });
                it('should return the Query Builder', () => {
                    const subquery = getQueryBuilder(CONNECTION, 'fake_table');
                    const query = getQueryBuilder();
                    assert.equal(
                        query.union(subquery),
                        query,
                    );
                });
            });
        });
        describe('unionAll method', () => {
            describe(`(${CLASS_NAME}) signature`, () => {
                it(`should add the ${CLASS_NAME} to the UNION clause`, () => {
                    const subquery = getQueryBuilder(CONNECTION, 'fake_table');
                    const query = getQueryBuilder();
                    query.unionAll(subquery);
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table UNION ALL SELECT * FROM fake_table'
                    );
                });
                it('should return the Query Builder', () => {
                    const subquery = getQueryBuilder(CONNECTION, 'fake_table');
                    const query = getQueryBuilder();
                    assert.equal(
                        query.unionAll(subquery),
                        query,
                    );
                });
            });
        });
        describe('unionAllRaw method', () => {
            describe('(<string>, <bind = []>) signature', () => {
                it('should add "UNION ALL <string>" to the query', () => {
                    const query = getQueryBuilder();
                    query.unionAllRaw(
                        'SELECT * FROM fake_table WHERE foo = {0}',
                        ['my-foo']
                    );
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table UNION ALL '
                            + 'SELECT * FROM fake_table WHERE foo = $1'
                    );
                });
                it('should add <...bind> to the bound arguments', () => {
                    const query = getQueryBuilder();
                    query.unionAllRaw(
                        'SELECT * FROM fake_table WHERE foo = {0}',
                        ['my-foo']
                    );
                    assert.equal(
                        query.compile().bound[0],
                        'my-foo'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.unionAllRaw(
                            'SELECT * FROM fake_table WHERE foo = {0}',
                            ['my-foo']
                        ),
                        query,
                    );
                });
            });
        });
        describe('unionRaw method', () => {
            describe('(<string>, <bind = []>) signature', () => {
                it('should add "UNION ALL <string>" to the query', () => {
                    const query = getQueryBuilder();
                    query.unionRaw(
                        'SELECT * FROM fake_table WHERE foo = {0}',
                        ['my-foo']
                    );
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table UNION '
                            + 'SELECT * FROM fake_table WHERE foo = $1'
                    );
                });
                it('should add <...bind> to the bound arguments', () => {
                    const query = getQueryBuilder();
                    query.unionRaw(
                        'SELECT * FROM fake_table WHERE foo = {0}',
                        ['my-foo']
                    );
                    assert.equal(
                        query.compile().bound[0],
                        'my-foo'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.unionRaw(
                            'SELECT * FROM fake_table WHERE foo = {0}',
                            ['my-foo']
                        ),
                        query,
                    );
                });
            });
        });
    });
    describe('ORDER BY clause', () => {
        describe('inRandomOrder method', () => {
            describe('() signature', () => {
                it(
                    'should add "ORDER BY RANDOM()" to the ORDER BY clause',
                    () => {
                        const query = getQueryBuilder();
                        query.inRandomOrder();
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table ORDER BY RANDOM()'
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.inRandomOrder(), query);
                });
            });
        });
        describe('orderBy method', () => {
            describe('(<field>, <ascending = true>) signature', () => {
                it(
                    'should add "<field> ASC" to the ORDER BY clause if '
                    + '<ascending> is true',
                    () => {
                        const query = getQueryBuilder();
                        query.orderBy('foo', true);
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table ORDER BY foo ASC'
                        );
                    }
                );
                it(
                    'should add "<field> DESC" to the ORDER BY clause if '
                    + '<ascending> is false',
                    () => {
                        const query = getQueryBuilder();
                        query.orderBy('foo', false);
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table ORDER BY foo DESC'
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.orderBy('foo'),
                        query
                    );
                });
            });
        });
        describe('orderByRaw method', () => {
            describe('(<string>) signature', () => {
                it('should add "<string>" to the ORDER BY clause', () => {
                    const query = getQueryBuilder();
                    query.orderByRaw('foo ASC');
                    query.orderByRaw('bar DESC');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table ORDER BY foo ASC, bar DESC'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.orderByRaw('foo ASC'),
                        query
                    );
                });
            });
        });
    });
    describe('LIMIT clause', () => {
        describe('limit method', () => {
            describe('(<count>) signature', () => {
                it('should set the LIMIT clause to "<count>"', () => {
                    const query = getQueryBuilder();
                    const LIMIT = 5;
                    query.limit(LIMIT);
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table LIMIT $1'
                    );
                });
                it('should add <count> to the bound arguments', () => {
                    const query = getQueryBuilder();
                    const LIMIT = 5;
                    query.limit(LIMIT);
                    assert.equal(
                        query.compile().bound[0],
                        LIMIT
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    const LIMIT = 5;
                    assert.equal(
                        query.limit(LIMIT),
                        query
                    );
                });
            });
        });
        describe('take method', () => {
            describe('(<count = 1>) signature', () => {
                it('should set the LIMIT clause to "<count>"', () => {
                    const query = getQueryBuilder();
                    query.take();
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table LIMIT $1'
                    );
                });
                it('should add <count> to the bound arguments', () => {
                    const query = getQueryBuilder();
                    query.take();
                    assert.equal(
                        query.compile().bound[0],
                        1
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.take(),
                        query
                    );
                });
            });
        });
    });
    describe('OFFSET clause', () => {
        describe('offset method', () => {
            describe('(<count>) signature', () => {
                it('should set the OFFSET clause to "<count>"', () => {
                    const query = getQueryBuilder();
                    const OFFSET = 5;
                    query.offset(OFFSET);
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table OFFSET $1'
                    );
                });
                it('should add <count> to the bound arguments', () => {
                    const query = getQueryBuilder();
                    const OFFSET = 5;
                    query.offset(OFFSET);
                    assert.equal(
                        query.compile().bound[0],
                        OFFSET
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    const OFFSET = 5;
                    assert.equal(
                        query.offset(OFFSET),
                        query
                    );
                });
            });
        });
        describe('skip method', () => {
            describe('(<count = 1>) signature', () => {
                it('should set the OFFSET clause to "<count>"', () => {
                    const query = getQueryBuilder();
                    query.skip();
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table OFFSET $1'
                    );
                });
                it('should add <count> to the bound arguments', () => {
                    const query = getQueryBuilder();
                    query.take();
                    query.skip();
                    assert.equal(
                        query.compile().bound[0],
                        1
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.skip(),
                        query
                    );
                });
            });
        });
    });
    describe('FOR clause', () => {
        describe('lockForUpdate', () => {
            describe('(<lock = true>) signature', () => {
                it('should set the FOR UPDATE clause if <lock> is true', () => {
                    const query = getQueryBuilder();
                    query.lockForUpdate();
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table FOR UPDATE',
                    );
                });
                it(
                    'should disable the FOR UPDATE clause if <lock> is false',
                    () => {
                        const query = getQueryBuilder();
                        query.lockForUpdate(false);
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table',
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.lockForUpdate(), query);
                });
            });
        });
        describe('sharedLock method', () => {
            describe('(<lock = true>) signature', () => {
                it('should set the FOR SHARE clause if <lock> is true', () => {
                    const query = getQueryBuilder();
                    query.sharedLock();
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table FOR SHARE',
                    );
                });
                it(
                    'should disable the FOR SHARE clause if <lock> is false',
                    () => {
                        const query = getQueryBuilder();
                        query.sharedLock(false);
                        assert.equal(
                            query.compile().query,
                            'SELECT * FROM table',
                        );
                    }
                );
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.sharedLock(), query);
                });
            });
        });
    });
    describe('auxiliary methods', () => {
        describe('boundArguments method', () => {
            describe('() signature', () => {
                it('should return an array of all bound arguments', () => {
                    const query  = getQueryBuilder();
                    query.where('foo', 'bar');
                    const args   = query.compile().bound;
                    query.boundArguments().forEach((value, i) => {
                        return assert.equal(value, args[i]);
                    });
                });
            });
        });
        describe('compile method', () => {
            describe('() signature', () => {
                it(
                    'should return the SQL query string at compile().query',
                    () => {
                        const query = getQueryBuilder();
                        assert.isString(query.compile().query);
                    }
                );
                it(
                    'should return an array of bound parameters at '
                    + 'compile().bound',
                    () => {
                        const query = getQueryBuilder();
                        assert.isArray(query.compile().bound);
                    }
                );
            });
        });
        describe('when method', () => {
            describe(
                '(<condition>, <onTrue:function(this)>, <onFalse:function(this)'
                    + ' = () => {}>) signature',
                () => {
                    it(
                        'should execute <onTrue> if <condition> is truthy',
                        () => {
                            const query = getQueryBuilder();
                            let isRun = false;
                            query.when('foo', (queryReference) => {
                                assert.equal(queryReference, query);
                                isRun = true;
                            });
                            assert.isTrue(isRun);
                        }
                    );
                    it(
                        'should execute <onFalse> if <condition> is falsy',
                        () => {
                            const query = getQueryBuilder();
                            let isRun = false;
                            query.when(
                                null,
                                () => 1,
                                (queryReference) => {
                                    assert.equal(queryReference, query);
                                    isRun = true;
                                }
                            );
                            assert.isTrue(isRun);
                        }
                    );
                    it('should return the Query Builder', () => {
                        const query = getQueryBuilder();
                        assert.equal(query.when('foo'), query);
                    });
                }
            );
        });
    });
});
