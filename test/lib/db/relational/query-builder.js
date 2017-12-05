/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = requireLib('util/assert');
const QueryBuilder = requireLib('db/relational/query-builder');

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
                it('should add the DISTINCT keyword to the SELECT clause', () => {
                    const query = getQueryBuilder();
                    query.distinct();
                    assert.equal(query.compile().query, 'SELECT DISTINCT * FROM table');
                });
                it('should remove the DISTINCT keyword if <enable> is false', () => {
                    const query = getQueryBuilder();
                    query.distinct();
                    query.distinct(false);
                    assert.equal(query.compile().query, 'SELECT * FROM table');
                });
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
                    assert.equal(query.compile().query, 'SELECT foo FROM table');
                });
                it('should accept any number of parameters', () => {
                    const query = getQueryBuilder();
                    query.select('foo', 'bar', 'baz');
                    assert.equal(query.compile().query, 'SELECT foo, bar, baz FROM table');
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.select('foo'), query);
                });
            });
            describe('({ <alias>: <field> }, ...) signature', () => {
                it('should add "<field> AS <alias>" to the SELECT clause', () => {
                    const query = getQueryBuilder();
                    query.select({ 'FOO': 'foo', 'BAR': 'bar'});
                    assert.equal(query.compile().query, 'SELECT foo AS "FOO", bar AS "BAR" FROM table');
                });
                it('should accept any number of parameters', () => {
                    const query = getQueryBuilder();
                    query.select({ 'FOO': 'foo', 'BAR': 'bar'}, { 'BAZ': 'baz' });
                    assert.equal(query.compile().query, 'SELECT foo AS "FOO", bar AS "BAR", baz AS "BAZ" FROM table');
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
                    assert.equal(query.compile().query, 'SELECT foo, bar, baz FROM table');
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
                    assert.equal(query.compile().query, 'SELECT AVG(foo) FROM table');
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.avg('foo'), query);
                });
            });
            describe('(<field>, <alias>) signature', () => {
                it('should add "avg(<field>) as <alias>" to the SELECT clause', () => {
                    const query = getQueryBuilder();
                    query.avg('foo', 'bar');
                    assert.equal(query.compile().query, 'SELECT AVG(foo) AS "bar" FROM table');
                });
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
                    assert.equal(query.compile().query, 'SELECT COUNT(foo) FROM table');
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.count('foo'), query);
                });
            });
            describe('(<field>, <alias>) signature', () => {
                it('should add "count(<field>) as <alias>" to the SELECT clause', () => {
                    const query = getQueryBuilder();
                    query.count('foo', 'bar');
                    assert.equal(query.compile().query, 'SELECT COUNT(foo) AS "bar" FROM table');
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
                    assert.equal(query.compile().query, 'SELECT MAX(foo) FROM table');
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.max('foo'), query);
                });
            });
            describe('(<field>, <alias>) signature', () => {
                it('should add "max(<field>) as <alias>" to the SELECT clause', () => {
                    const query = getQueryBuilder();
                    query.max('foo', 'bar');
                    assert.equal(query.compile().query, 'SELECT MAX(foo) AS "bar" FROM table');
                });
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
                    assert.equal(query.compile().query, 'SELECT MIN(foo) FROM table');
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.min('foo'), query);
                });
            });
            describe('(<field>, <alias>) signature', () => {
                it('should add "min(<field>) as <alias>" to the SELECT clause', () => {
                    const query = getQueryBuilder();
                    query.min('foo', 'bar');
                    assert.equal(query.compile().query, 'SELECT MIN(foo) AS "bar" FROM table');
                });
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
                    assert.equal(query.compile().query, 'SELECT SUM(foo) FROM table');
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.sum('foo'), query);
                });
            });
            describe('(<field>, <alias>) signature', () => {
                it('should add "sum(<field>) as <alias>" to the SELECT clause', () => {
                    const query = getQueryBuilder();
                    query.sum('foo', 'bar');
                    assert.equal(query.compile().query, 'SELECT SUM(foo) AS "bar" FROM table');
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.sum('foo', 'bar'), query);
                });
            });
        });
    });
    describe('INSERT INTO <table-name> (<fields>) VALUES (<values>) clause', () => {
        describe('insert method', () => {
            describe('({ <field>: <value>, ... }) signature', () => {
                it('should send the request', () => {
                    let sent = false;
                    const connection = {
                        send() {
                            sent = true;
                        }
                    };
                    getQueryBuilder(connection).insert({});
                    assert.isTrue(sent);
                });
                it('should add "(<...field>) VALUES (<...value>) to the INSERT clause', () => {
                    const fields = { 'foo': 'my-foo', 'bar': 'my-bar' };
                    const connection = {
                        send(query) {
                            assert.equal(query, 'INSERT INTO table (foo, bar) VALUES ($1, $2)');
                        }
                    };
                    getQueryBuilder(connection).insert(fields);
                });
                it('should accept any number of arguments', () => {
                    const fields = [
                        { 'foo': 'my-foo',  'bar': 'my-bar'  },
                        { 'foo': 'muh-foo', 'bar': 'muh-bar' },
                    ];
                    const connection = {
                        send(query) {
                            assert.equal(query, 'INSERT INTO table (foo, bar) VALUES ($1, $2), ($3, $4)');
                        }
                    };
                    getQueryBuilder(connection).insert(...fields);
                });
                it('should add every <value> to the bound arguments', () => {
                    const fields = { 'foo': 'my-foo', 'bar': 'my-bar' };
                    const connection = {
                        send(query, bind) {
                            assert.equal(bind.length, 2);
                        }
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
                        }
                    };
                    getQueryBuilder(connection, '<table>').insertRaw(
                        '(foo, bar) VALUES ($1, $2), ($3, $4)',
                        ['foo', 'bar', 'my-foo', 'my-bar']
                    );
                    assert.isTrue(sent);
                });
                it('should add "(<...field>) VALUES (<...value>), ... to the INSERT clause', () => {
                    const connection = {
                        send(query) {
                            assert.equal(query, 'INSERT INTO <table> (foo, bar) VALUES ($1, $2), ($3, $4)');
                        }
                    };
                    getQueryBuilder(connection, '<table>').insertRaw(
                        '(foo, bar) VALUES ($1, $2), ($3, $4)',
                        ['my-foo', 'my-bar', 'muh-foo', 'muh-bar']
                    );
                });
                it('should add every <value> to the bound arguments', () => {
                    const connection = {
                        send(query, bind) {
                            assert.equal(bind.length, 4);
                        }
                    };
                    getQueryBuilder(connection, '<table>').insertRaw(
                        '(foo, bar) VALUES ($1, $2), ($3, $4)',
                        ['my-foo', 'my-bar', 'muh-foo', 'muh-bar']
                    );
                });
            });
        });
    });
    describe('UPDATE <table-name> SET clause', () => {
        describe('decrement method', () => {
            describe('(<decr-field>, <decr-value = 1>, { <field>: <value>, ... } = {}) signature', () => {
                it('should send the request', () => {
                    let sent = false;
                    const connection = {
                        send() { sent = true; }
                    };
                    const query = getQueryBuilder(connection);
                    query.decrement('decr', 1, { 'field': 'my-foo' });
                    assert.isTrue(sent);
                });
                it('should set the SET clause to include "<decr-field> = <decr-field> - <decr-value>"', () => {
                    const connection = {
                        send(query) {
                            assert.equal(query, 'UPDATE table SET decr = decr - $1');
                        }
                    };
                    const query = getQueryBuilder(connection);
                    query.decrement('decr');
                });
                it('should set the SET clause to include "<field> = <value>" for each key/value pair', () => {
                    const connection = {
                        send(query) {
                            assert.equal(query, 'UPDATE table SET decr = decr - $1, field = $2');
                        }
                    };
                    const query = getQueryBuilder(connection);
                    query.decrement('decr', 1, { 'field': 'my-foo' });
                });
                it('should add all of the <value> and <incr-value> values to the bound arguments', () => {
                    const connection = {
                        send(query, bind) {
                            assert.equal(bind.length, 2);
                        }
                    };
                    const query = getQueryBuilder(connection);
                    query.decrement('decr', 1, { 'field': 'my-foo' });
                });
            });
            describe('({ <incr-field>: <incr-value>, ... }, { <field>: <value>, ... } = {}) signature', () => {
                it('should send the request', () => {
                    let sent = false;
                    const connection = {
                        send() { sent = true; }
                    };
                    const query = getQueryBuilder(connection);
                    query.decrement({ 'foo': 1, 'bar': 2 }, { 'field': 'my-foo' });
                    assert.isTrue(sent);
                });
                it('should set the SET clause to include "<incr-field> = <incr-field> + <incr-value>" for each key/value pair', () => {
                    const connection = {
                        send(query) {
                            assert.equal(query, 'UPDATE table SET foo = foo - $1, bar = bar - $2');
                        }
                    };
                    const query = getQueryBuilder(connection);
                    query.decrement({ 'foo': 1, 'bar': 2 });
                });
                it('should set the SET clause to include "<field> = <value>" for each key/value pair', () => {
                    const connection = {
                        send(query) {
                            assert.equal(query, 'UPDATE table SET foo = foo - $1, bar = bar - $2, field = $3');
                        }
                    };
                    const query = getQueryBuilder(connection);
                    query.decrement({ 'foo': 1, 'bar': 2 }, { 'field': 'my-foo' });
                });
                it('should add all of the <value> and <incr-value> values to the bound arguments', () => {
                    const connection = {
                        send(query, bind) {
                            assert.equal(bind.length, 3);
                        }
                    };
                    const query = getQueryBuilder(connection);
                    query.decrement({ 'foo': 1, 'bar': 2 }, { 'field': 'my-foo' });
                });
            });
        });
        describe('increment method', () => {
            describe('(<incr-field>, <incr-value = 1>, { <field>: <value>, ...} = {}) signature', () => {
                it('should send the request', () => {
                    let sent = false;
                    const connection = {
                        send() { sent = true; }
                    };
                    const query = getQueryBuilder(connection);
                    query.increment('incr');
                    assert.isTrue(sent);
                });
                it('should set the SET clause to include "<incr-field> = <incr-field> + <incr-value>"', () => {
                    const connection = {
                        send(query) {
                            assert.equal(query, 'UPDATE table SET incr = incr + $1');
                        }
                    };
                    const query = getQueryBuilder(connection);
                    query.increment('incr');
                });
                it('should set the SET clause to include "<field> = <value>" for each key/value pair', () => {
                    const connection = {
                        send(query) {
                            assert.equal(query, 'UPDATE table SET incr = incr + $1, foo = $2');
                        }
                    };
                    const query = getQueryBuilder(connection);
                    query.increment('incr', 1, { 'foo': 'foo' });
                });
                it('should add all of the <value> and <incr-value> values to the bound arguments', () => {
                    const connection = {
                        send(query, bind) {
                            assert.equal(bind.length, 2);
                        }
                    };
                    const query = getQueryBuilder(connection);
                    query.increment('incr', 1, { 'foo': 'foo' });
                });
            });
            describe('({ <incr-field>: <incr-value>, ... }, { <field>: <value>, ... } = {}) signature', () => {
                it('should send the request', () => {
                    let sent = false;
                    const connection = {
                        send() { sent = true; }
                    };
                    const query = getQueryBuilder(connection);
                    query.increment({ 'foo': 1, 'bar': 2 }, { 'field': 'my-foo' });
                    assert.isTrue(sent);
                });
                it('should set the SET clause to include "<incr-field> = <incr-field> + <incr-value>" for each key/value pair', () => {
                    const connection = {
                        send(query) {
                            assert.equal(query, 'UPDATE table SET foo = foo + $1, bar = bar + $2');
                        }
                    };
                    const query = getQueryBuilder(connection);
                    query.increment({ 'foo': 1, 'bar': 2 });
                });
                it('should set the SET clause to include "<field> = <value>" for each key/value pair', () => {
                    const connection = {
                        send(query) {
                            assert.equal(query, 'UPDATE <table> SET foo = foo + $1, bar = bar + $2, field = $3');
                        }
                    };
                    const query = getQueryBuilder(connection, '<table>');
                    query.increment({ 'foo': 1, 'bar': 2 }, { 'field': 'my-foo' });
                });
                it('should add all of the <value> and <incr-value> values to the bound arguments', () => {
                    const connection = {
                        send(query, bind) {
                            assert.equal(bind.length, 3);
                        }
                    };
                    const query = getQueryBuilder(connection, '<table>');
                    query.decrement({ 'foo': 1, 'bar': 2 }, { 'field': 'my-foo' });
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
                        }
                    };
                    const query = getQueryBuilder(connection);
                    query.update({ foo: true });
                    assert.isTrue(wasSent);
                });
                it('should set the SET clause to "<field> = <value>" for each key/value pair', () => {
                    const connection = {
                        send(query) {
                            assert.equal(query, 'UPDATE table SET foo = $1');
                        }
                    };
                    const query = getQueryBuilder(connection);
                    query.update({ foo: true });
                });
                it('should add each <value> to the bound arguments', () => {
                    const connection = {
                        send(query, bind) {
                            assert.equal(bind.length, 1);
                        }
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
                        }
                    };
                    const query = getQueryBuilder(connection);
                    query.updateRaw('foo = $1', ['my-foo']);
                    assert.isTrue(wasSent);
                });
                it('should set the SET clause to "<signature>"', () => {
                    const connection = {
                        send(query) {
                            assert.equal(query, 'UPDATE table SET foo = $1, bar = $2');
                        }
                    };
                    const query = getQueryBuilder(connection);
                    query.updateRaw('foo = $1, bar = $2', ['my-foo', 'my-bar']);
                });
                it('should add each <...values> to the bound arguments', () => {
                    const connection = {
                        send(query, bind) {
                            assert.equal(bind.length, 2);
                        }
                    };
                    const query = getQueryBuilder(connection);
                    query.updateRaw('foo = $1, bar = $2', ['my-foo', 'my-bar']);
                });
            });
        });
    });
    describe('DELETE clause', () => {
        describe('delete method', () => {
            describe('() signature', () => {
                it('should send the request');
            });
        });
    });
    describe('TRUNCATE clause', () => {
        describe('truncate method', () => {
            describe('() signature', () => {
                it('should send the request');
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
                    assert.equal(query.compile().query, 'SELECT * FROM table AS "alias"');
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
                    assert.equal(query.compile().query, 'SELECT * FROM "table" AS "alias"');
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
                it('should add "CROSS JOIN <table>" to the query');
                it('should return the Query Builder');
            });
            describe('({ <alias>: <table> }) signature', () => {
                it('should add "CROSS JOIN <table> AS <alias>" to the query');
                it('should return the Query Builder');
            });
        });
        describe('crossJoinRaw method', () => {
            describe('(<definition>) signature', () => {
                it('should add "CROSS JOIN <definition>" to the query');
                it('should return the Query Builder');
            });
        });
        describe('join method', () => {
            describe('(<table>, <key-name>) signature', () => {
                it('should add "INNER JOIN <table> ON <table>.<key-name> = <this.table>.<key-name>" to the query');
                it('should return the Query Builder');
            });
            describe('({ <alias>: <table> }, <key-name>) signature', () => {
                it('should add "INNER JOIN <table> AS <alias> ON <alias>.<key-name> = <this.table>.<key-name>" to the query');
                it('should return the Query Builder');
            });
            describe('(<table>, <local-key>, <remote-key>) signature', () => {
                it('should add "INNER JOIN <table> ON <table>.<remote-key> = <this.table>.<local-key>" to the query');
                it('should return the Query Builder');
            });
            describe('({ <alias>: <table> }, <local-key>, <operation>, <remote-key>', () => {
                it('should add "INNER JOIN <table> AS <alias> ON <alias>.<remote-key> = <this.table>.<local-key>" to the query');
                it('should return the Query Builder');
            });
            describe('(<table>, <local-key>, <operation>, <remote-key>) signature', () => {
                it('should add "INNER JOIN <table> ON <table>.<remote-key> <operation> <this.table>.<local-key>" to the query');
                it('should return the Query Builder');
            });
            describe('({ <alias>: <table> }, <local-key>, <operation>, <remote-key>) signature', () => {
                it('should add "INNER JOIN <table> AS <alias> ON <alias>.<remote-key> <operation> <this.table>.<local-key>" to the query');
                it('should return the Query Builder');
            });
        });
        describe('joinRaw method', () => {
            describe('(<definition>, <bind = []>) signature', () => {
                it('should add "INNER JOIN <definition>" to the query');
                it('should add <...bind> to the bound arguments');
                it('should return the Query Builder');
            });
        });
        describe('leftJoin method', () => {
            describe('(<table>, <key-name>) signature', () => {
                it('should add "LEFT JOIN <table> ON <table>.<key-name> = <this.table>.<key-name>" to the query');
                it('should return the Query Builder');
            });
            describe('({ <alias>: <table> }, <key-name>) signature', () => {
                it('should add "LEFT JOIN <table> AS <alias> ON <alias>.<key-name> = <this.table>.<key-name>" to the query');
                it('should return the Query Builder');
            });
            describe('(<table>, <local-key>, <remote-key>) signature', () => {
                it('should add "LEFT JOIN <table> ON <table>.<remote-key> = <this.table>.<local-key>" to the query');
                it('should return the Query Builder');
            });
            describe('({ <alias>: <table> }, <local-key>, <operation>, <remote-key>', () => {
                it('should add "LEFT JOIN <table> AS <alias> ON <alias>.<remote-key> = <this.table>.<local-key>" to the query');
                it('should return the Query Builder');
            });
            describe('(<table>, <local-key>, <operation>, <remote-key>) signature', () => {
                it('should add "LEFT JOIN <table> ON <table>.<remote-key> <operation> <this.table>.<local-key>" to the query');
                it('should return the Query Builder');
            });
            describe('({ <alias>: <table> }, <local-key>, <operation>, <remote-key>) signature', () => {
                it('should add "LEFT JOIN <table> AS <alias> ON <alias>.<remote-key> <operation> <this.table>.<local-key>" to the query');
                it('should return the Query Builder');
            });
        });
        describe('leftJoinRaw method', () => {
            describe('(<signature>, <bind = []>) signature', () => {
                it('should add "LEFT JOIN <signature>" to the query');
                it('should add <...bind> to the bound arguments');
                it('should return the Query Builder');
            });
        });
        describe('rightJoin method', () => {
            describe('(<table>, <key-name>) signature', () => {
                it('should add "RIGHT JOIN <table> ON <table>.<key-name> = <this.table>.<key-name>" to the query');
                it('should return the Query Builder');
            });
            describe('({ <alias>: <table> }, <key-name>) signature', () => {
                it('should add "RIGHT JOIN <table> AS <alias> ON <alias>.<key-name> = <this.table>.<key-name>" to the query');
                it('should return the Query Builder');
            });
            describe('(<table>, <local-key>, <remote-key>) signature', () => {
                it('should add "RIGHT JOIN <table> ON <table>.<remote-key> = <this.table>.<local-key>" to the query');
                it('should return the Query Builder');
            });
            describe('({ <alias>: <table> }, <local-key>, <operation>, <remote-key>', () => {
                it('should add "RIGHT JOIN <table> AS <alias> ON <alias>.<remote-key> = <this.table>.<local-key>" to the query');
                it('should return the Query Builder');
            });
            describe('(<table>, <local-key>, <operation>, <remote-key>) signature', () => {
                it('should add "RIGHT JOIN <table> ON <table>.<remote-key> <operation> <this.table>.<local-key>" to the query');
                it('should return the Query Builder');
            });
            describe('({ <alias>: <table> }, <local-key>, <operation>, <remote-key>) signature', () => {
                it('should add "RIGHT JOIN <table> AS <alias> ON <alias>.<remote-key> <operation> <this.table>.<local-key>" to the query');
                it('should return the Query Builder');
            });
        });
        describe('rightJoinRaw method', () => {
            describe('(<signature>, <bind = []>) signature', () => {
                it('should add "RIGHT JOIN <signature>" to the query');
                it('should add <...bind> to the bound arguments');
                it('should return the Query Builder');
            });
        });
    });
    describe('WHERE clause', () => {
        describe('orWhere method', () => {
            describe('(<field>, <value>) signature', () => {
                it('should set WHERE <field> = <value> on SELECT queries', () => {
                    const query = getQueryBuilder();
                    query.where('foo', 'bar').orWhere('bar', 'baz');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table WHERE foo = $1 OR bar = $2'
                    );
                });
                it('should set WHERE <field> = <value> on UPDATE queries', () => {
                    const connection = {
                        send(query) {
                            assert.equal(
                                query,
                                'UPDATE table WHERE foo = $1 OR bar = $2'
                            );
                        }
                    };
                    getQueryBuilder(connection)
                        .where('foo', 'bar')
                        .orWhere('bar', 'baz')
                        .update();
                });
                it('should set WHERE <field> = <value> on DELETE queries', () => {
                    const connection = {
                        send(query) {
                            assert.equal(
                                query,
                                'DELETE FROM table WHERE foo = $1 OR bar = $2'
                            );
                        }
                    };
                    getQueryBuilder(connection)
                        .where('foo', 'bar')
                        .orWhere('bar', 'baz')
                        .delete();
                });
                it('should add <value> to the bound arguments on SELECT queries', () => {
                    const query = getQueryBuilder();
                    query.where('foo', 'bar');
                    query.orWhere('bar', 'baz');
                    assert.equal(query.compile().bound.length, 2);
                });
                it('should add <value> to the bound arguments on UPDATE queries', () => {
                    const connection = {
                        send(query, bound) {
                            assert.equal(bound.length, 2);
                        }
                    };
                    getQueryBuilder(connection)
                        .where('foo', 'bar')
                        .orWhere('bar', 'baz')
                        .update();
                });
                it('should add <value> to the bound arguments on DELETE queries', () => {
                    const connection = {
                        send(query, bound) {
                            assert.equal(bound.length, 2);
                        }
                    };
                    getQueryBuilder(connection)
                        .where('foo', 'bar')
                        .orWhere('bar', 'baz')
                        .delete();
                });
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
                it('should set WHERE ... <field> <operator> <value> on SELECT queries', () => {
                    const query = getQueryBuilder();
                    query.where('foo', 'bar').orWhere('foo', '!=', 'baz');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table WHERE foo = $1 OR foo != $2'
                    );
                });
                it('should set WHERE ... <field> <operator> <value> on UPDATE queries', () => {
                    const connection = {
                        send(query) {
                            assert.equal(
                                query,
                                'UPDATE table WHERE foo = $1 OR foo != $2'
                            );
                        }
                    };
                    getQueryBuilder(connection)
                        .where('foo', 'bar')
                        .orWhere('foo', '!=', 'baz')
                        .update();
                });
                it('should set WHERE ... <field> <operator> <value> on DELETE queries', () => {
                    const connection = {
                        send(query) {
                            assert.equal(
                                query,
                                'DELETE FROM table WHERE foo = $1 OR foo != $2'
                            );
                        }
                    };
                    getQueryBuilder(connection)
                        .where('foo', 'bar')
                        .orWhere('foo', '!=', 'baz')
                        .delete();
                });
                it('should add <value> to the bound arguments on SELECT queries', () => {
                    const query = getQueryBuilder();
                    query.where('foo', 'bar').orWhere('foo', '!=', 'baz');
                    assert.equal(query.compile().bound.length, 2);
                });
                it('should add <value> to the bound arguments on UPDATE queries', () => {
                    const connection = {
                        send(query, bound) {
                            assert.equal(bound.length, 2);
                        }
                    };
                    getQueryBuilder(connection)
                        .where('foo', 'bar')
                        .orWhere('foo', '!=', 'baz')
                        .update();
                });
                it('should add <value> to the bound arguments on DELETE queries', () => {
                    const connection = {
                        send(query, bound) {
                            assert.equal(bound.length, 2);
                        }
                    };
                    getQueryBuilder(connection)
                        .where('foo', 'bar')
                        .orWhere('foo', '!=', 'baz')
                        .delete();
                });
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
                it('should set WHERE ... <conditional> on SELECT queries', () => {
                    const query = getQueryBuilder();
                    query.where('foo', 'bar');
                    query.orWhereRaw('foo = $2', ['baz']);
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table WHERE foo = $1 OR foo = $2'
                    );
                });
                it('should set WHERE ... <conditional> on UPDATE queries', () => {
                    const connection = {
                        send(query) {
                            assert.equal(
                                query,
                                'UPDATE table WHERE foo = $1 OR foo = $2'
                            );
                        }
                    };
                    getQueryBuilder(connection)
                        .where('foo', 'bar')
                        .orWhereRaw('foo = $2', ['baz'])
                        .update();
                });
                it('should set WHERE ... <conditional> on DELETE queries', () => {
                    const connection = {
                        send(query) {
                            assert.equal(
                                query,
                                'DELETE FROM table WHERE foo = $1 OR foo = $2'
                            );
                        }
                    };
                    getQueryBuilder(connection)
                        .where('foo', 'bar')
                        .orWhereRaw('foo = $2', ['baz'])
                        .delete();
                });
                it('should add <...bind> to the bound arguments on SELECT queries', () => {
                    const query = getQueryBuilder();
                    query.where('foo', 'bar');
                    query.orWhereRaw('foo = $2', ['baz']);
                    assert.equal(query.compile().bound.length, 2);
                });
                it('should add <...bind> to the bound arguments on UPDATE queries', () => {
                    const connection = {
                        send(query, bound) {
                            assert.equal(bound.length, 2);
                        }
                    };
                    getQueryBuilder(connection)
                        .where('foo', 'bar')
                        .orWhereRaw('foo = $2', ['baz'])
                        .update();
                });
                it('should add <...bind> to the bound arguments on DELETE queries', () => {
                    const connection = {
                        send(query, bound) {
                            assert.equal(bound.length, 2);
                        }
                    };
                    getQueryBuilder(connection)
                        .where('foo', 'bar')
                        .orWhereRaw('foo = $2', ['baz'])
                        .delete();
                });
                it('should join conditionals with ... OR ...', () => {
                    const query = getQueryBuilder();
                    query.where('foo', 'bar').orWhereRaw('foo = $2', ['baz']);
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table WHERE foo = $1 OR foo = $2'
                    );
                });
                it('should return the Query Builder', () => {
                    const query = getQueryBuilder();
                    assert.equal(query.orWhereRaw('foo = $1', ['foo']), query);
                });
            });
        });
        describe('where method', () => {
            describe('(<field>, <value>) signature', () => {
                it('should set WHERE ... <field> = <value> on SELECT queries', () => {
                    assert.equal(
                        getQueryBuilder().where('foo', 'bar').compile().query,
                        'SELECT * FROM table WHERE foo = $1'
                    );
                });
                it('should set WHERE ... <field> = <value> on UPDATE queries', () => {
                    const connection = {
                        send(query) {
                            assert.equal(
                                query,
                                'UPDATE table WHERE foo = $1'
                            );
                        }
                    };
                    getQueryBuilder(connection).where('foo', 'bar').update();
                });
                it('should set WHERE ... <field> = <value> on DELETE queries', () => {
                    const connection = {
                        send(query) {
                            assert.equal(
                                query,
                                'DELETE FROM table WHERE foo = $1'
                            );
                        }
                    };
                    getQueryBuilder(connection).where('foo', 'bar').delete();
                });
                it('should add <value> to the bound arguments on SELECT queries', () => {
                    assert.equal(
                        getQueryBuilder().where('foo', 'bar').compile().bound.length,
                        1
                    );
                });
                it('should add <value> to the bound arguments on UPDATE queries', () => {
                    const connection = {
                        send(query, bound) {
                            assert.equal(bound.length, 1);
                        }
                    };
                    getQueryBuilder(connection).where('foo', 'bar').update();
                });
                it('should add <value> to the bound arguments on DELETE queries', () => {
                    const connection = {
                        send(query, bound) {
                            assert.equal(bound.length, 1);
                        }
                    };
                    getQueryBuilder(connection).where('foo', 'bar').delete();
                });
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
                it('should set WHERE ... <field> <operator> <value> on SELECT queries', () => {
                    const query = getQueryBuilder();
                    query.where('foo', '<=', 'bar');
                    assert.equal(
                        query.compile().query,
                        'SELECT * FROM table WHERE foo <= $1'
                    );
                });
                it('should set WHERE ... <field> <operator> <value> on UPDATE queries', () => {
                    const connection = {
                        send(query) {
                            assert.equal(
                                query,
                                'UPDATE table WHERE foo <= $1'
                            );
                        }
                    };
                    const query = getQueryBuilder(connection);
                    query.where('foo', '<=', 'bar');
                    query.update();
                });
                it('should set WHERE ... <field> <operator> <value> on DELETE queries', () => {
                    const connection = {
                        send(query) {
                            assert.equal(
                                query,
                                'DELETE FROM table WHERE foo <= $1'
                            );
                        }
                    };
                    const query = getQueryBuilder(connection);
                    query.where('foo', '<=', 'bar');
                    query.delete();
                });
                it('should add <value> to the bound arguments on SELECT queries', () => {
                    const query = getQueryBuilder();
                    query.where('foo', '<=', 'bar');
                    assert.equal(query.compile().bound.length, 1);
                });
                it('should add <value> to the bound arguments on UPDATE queries', () => {
                    const connection = {
                        send(query, bound) {
                            assert.equal(bound.length, 1);
                        }
                    };
                    const query = getQueryBuilder(connection);
                    query.where('foo', '<=', 'bar');
                    query.update();
                });
                it('should add <value> to the bound arguments on DELETE queries', () => {
                    const connection = {
                        send(query, bound) {
                            assert.equal(bound.length, 1);
                        }
                    };
                    const query = getQueryBuilder(connection);
                    query.where('foo', '<=', 'bar');
                    query.delete();
                });
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
            describe('(<field>, [<x>, <y>], <inclusive = true>) signature', () => {
                it('should add "<field> >= <Min(x, y)>" to the WHERE clause if <inclusive> is true');
                it('should add "<field> <= <Max(x, y)>" to the WHERE clause if <inclusive> is true');
                it('should add "<field> > <Min(x, y)>" to the WHERE clause if <inclusive> is false');
                it('should add "<field> < <Max(x, y)>" to the WHERE clause if <inclusive> is false');
                it('should join conditionals with ... AND ...');
                it('should return the Query Builder');
            });
        });
        describe('whereColumn method', () => {
            describe('(<field-1>, <field-2>) signature', () => {
                it('should add "<field-1> = <field-2>" to the WHERE clause');
                it('should return the Query Builder');
            });
            describe('(<field-1>, <operator>, <field-2>) signature', () => {
                it('should add "<field-1> <operator> <field-2>" to the WHERE clause');
                it('should return the Query Builder');
            });
        });
        describe('whereDate method', () => {
            describe('(<field>, <date>) signature', () => {
                it('should add "<field> = <date>" to the WHERE clause');
                it('should add <date> to the bound arguments');
                it('should accept a Date object for the <date> field and extract the appropriate date');
                it('should return the Query Builder');
            });
            describe('(<field>, <operator>, <date>) signature', () => {
                it('should add "<field> <operator> <date>" to the WHERE clause');
                it('should add <date> to the bound arguments');
                it('should throw an error if <date> is not a positive integer');
                it('should accept a Date object for the <date> field and extract the appropriate date');
                it('should return the Query Builder');
            });
        });
        describe('whereDay method', () => {
            describe('(<field>, <day>) signature', () => {
                it('should add "DAY(<field>) = <day>" to the WHERE clause');
                it('should add <day> to the bound arguments');
                it('should throw an error if <day> is not an integer in the range [1 .. 31]');
                it('should accept a Date object for the <day> field and extract the appropriate day');
                it('should return the Query Builder');
            });
            describe('(<field>, <operator>, <day>) signature', () => {
                it('should add "DAY(<field>) <operator> <day>" to the WHERE clause');
                it('should add <day> to the bound arguments');
                it('should throw an error if <day> is not a positive integer');
                it('should accept a Date object for the <day> field and extract the appropriate day');
                it('should return the Query Builder');
            });
        });
        describe('whereExists method', () => {
            describe(`(<query:${CLASS_NAME}>) signature`, () => {
                it('should add "EXISTS (<query>) to the WHERE clause');
                it('should return the Query Builder');
            });
        });
        describe('whereExistsRaw method', () => {
            describe('(<query:string>, <bind = []>) signature', () => {
                it('should add "EXISTS (<query>) to the WHERE clause');
                it('should add <...bind> to the bound arguments');
                it('should return the Query Builder');
            });
        });
        describe('whereIn method', () => {
            describe('(<field>, <values = []>) signature', () => {
                it('should add "<field> IN (<...values>)" to the WHERE clause');
                it('should add <...values> to the bound arguments');
                it('should use "<field> IS NULL" if a blank array is passed');
                it('should throw an error if a non-array value is passed');
                it('should join conditionals with ... AND ...');
                it('should return the Query Builder');
            });
        });
        describe('whereMonth method', () => {
            describe('(<field>, <month>) signature', () => {
                it('should add "MONTH(<field>) = <month>" to the WHERE clause');
                it('should add <month> to the bound arguments');
                it('should throw an error if <month> is not in the range [1..12]');
                it('should accept a Date object for the <month> field and extract the appropriate month');
                it('should return the Query Builder');
            });
            describe('(<field>, <operator>, <month>) signature', () => {
                it('should add "MONTH(<field>) <operator> <month>" to the WHERE clause');
                it('should add <month> to the bound arguments');
                it('should throw an error if <month> is not in the range [1..12]');
                it('should accept a Date object for the <month> field and extract the appropriate month');
                it('should return the Query Builder');
            });
        });
        describe('whereNotBetween method', () => {
            describe('(<field>, [<x>, <y>], <inclusive = true>) signature', () => {
                it('should add "<field> < <Min(x, y)>" to the WHERE clause if <inclusive> is true');
                it('should add "<field> > <Max(x, y)>" to the WHERE clause if <inclusive> is true');
                it('should add "<field> <= <Min(x, y)>" to the WHERE clause if <inclusive> is false');
                it('should add "<field> >= <Max(x, y)>" to the WHERE clause if <inclusive> is false');
                it('should join conditionals with ... AND ...');
                it('should return the Query Builder');
            });
        });
        describe('whereNotIn method', () => {
            describe('(<field>, <values = []>) signature', () => {
                it('should add "<field> NOT IN (<...values>)" to the WHERE clause');
                it('should add <...values> to the bound arguments');
                it('should use "<field> IS NOT NULL" if a blank array is passed');
                it('should throw an error if a non-array value is passed');
                it('should join conditionals with ... AND ...');
                it('should return the Query Builder');
            });
        });
        describe('whereNull method', () => {
            describe('(<field>, ...) signature', () => {
                it('should add "<field> IS NULL" to the WHERE clause for each <field>');
                it('should join conditionals with ... AND ...');
                it('should return the Query Builder');
            });
        });
        describe('whereNotNull method', () => {
            describe('(<field>, ...) signature', () => {
                it('should add "<field> IS NOT NULL" to the WHERE clause for each <field>');
                it('should join conditionals with ... AND ...');
                it('should return the Query Builder');
            });
        });
        describe('whereRaw method', () => {
            describe('(<conditional>, <bind = []>) signature', () => {
                it('should set WHERE ... <conditional> on SELECT queries', () => {
                    const query = getQueryBuilder();
                    assert.equal(
                        query.whereRaw('foo is null').compile().query,
                        'SELECT * FROM table WHERE foo is null'
                    );
                });
                it('should set WHERE ... <conditional> on UPDATE queries', () => {
                    const connection = {
                        send(query) {
                            assert.equal(query, 'UPDATE table WHERE foo is null');
                        }
                    };
                    getQueryBuilder(connection)
                        .whereRaw('foo is null')
                        .update();
                });
                it('should set WHERE ... <conditional> on DELETE queries', () => {
                    const connection = {
                        send(query) {
                            assert.equal(query, 'DELETE FROM table WHERE foo is null');
                        }
                    };
                    getQueryBuilder(connection)
                        .whereRaw('foo is null')
                        .delete();
                });
                it('should add <...bind> to the bound arguments on SELECT queries', () => {
                    assert.equal(
                        getQueryBuilder().whereRaw('foo = $1', [1]).compile().bound.length,
                        1
                    );
                });
                it('should add <...bind> to the bound arguments on UPDATE queries', () => {
                    const connection = {
                        send(query, bound) {
                            assert.equal(bound.length, 1);
                        }
                    };
                    getQueryBuilder(connection)
                        .whereRaw('foo = $1', [1])
                        .update();
                });
                it('should add <...bind> to the bound arguments on DELETE queries', () => {
                    const connection = {
                        send(query, bound) {
                            assert.equal(bound.length, 1);
                        }
                    };
                    getQueryBuilder(connection).whereRaw('foo = $1', [1]).delete();
                });
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
                it('should add "YEAR(<field>) = <year>" to the WHERE clause');
                it('should add <year> to the bound arguments');
                it('should throw an error if <year> is not an integer');
                it('should accept a Date object for the <year> field and extract the appropriate year');
                it('should return the Query Builder');
            });
            describe('(<field>, <operator>, <year>) signature', () => {
                it('should add "YEAR(<field>) <operator> <year>" to the WHERE clause');
                it('should add <year> to the bound arguments');
                it('should throw an error if <year> is not a positive integer');
                it('should accept a Date object for the <year> field and extract the appropriate year');
                it('should return the Query Builder');
            });
        });
    });
    describe('GROUP BY clause', () => {
        describe('groupBy method', () => {
            describe('(<field>, ...) signature', () => {
                it('should add "<field>" to the GROUP BY clause for each <field>');
                it('should return the Query Builder');
            });
            describe('({ <table>: <field> }, ...) signature', () => {
                it('should add "<table>.<field>" to the GROUP BY clause for each object');
                it('should return the Query Builder');
            });
            describe('({ <table>: <field[]> }, ...) signature', () => {
                it('should add "<table>.<field>" to the GROUP BY clause for each table/field pair');
                it('should return the Query Builder');
            });
        });
        describe('groupByRaw method', () => {
            describe('(<signature>) signature', () => {
                it('should add "<signature>" to the GROUP BY clause');
                it('should return the Query Builder');
            });
        });
    });
    describe('HAVING clause', () => {
        describe('having method', () => {
            describe('(<field>, <value>) signature', () => {
                it('should set HAVING ... <field> = <value> on the query');
                it('should add <value> to the bound arguments');
                it('should join conditionals with ... AND ...');
                it('should return the Query Builder');
            });
            describe('(<field>, <operator>, <value>) signature', () => {
                it('should set HAVING ... <field> <operator> <value>');
                it('should add <value> to the bound arguments');
                it('should join conditionals with ... AND ...');
                it('should return the Query Builder');
            });
        });
        describe('havingRaw method', () => {
            describe('(<condition>, <bind = []>) signature', () => {
                it('should set HAVING ... <condition> on the query');
                it('should add <...bind> to the bound arguments');
                it('should join conditionals with ... AND ...');
                it('should return the Query Builder');
            });
        });
        describe('orHaving method', () => {
            describe('(<field>, <value>) signature', () => {
                it('should set HAVING ... <field> = <value> on the query');
                it('should add <value> to the bound arguments');
                it('should join conditionals with ... OR ...');
                it('should return the Query Builder');
            });
            describe('(<field>, <operator>, <value>) signature', () => {
                it('should set HAVING ... <field> <operator> <value>');
                it('should add <value> to the bound arguments');
                it('should join conditionals with ... OR ...');
                it('should return the Query Builder');
            });
        });
        describe('orHavingRaw method', () => {
            describe('(<condition>, <bind = []> signature', () => {
                it('should set HAVING ... <condition> on the query');
                it('should add <...bind> to the bound arguments');
                it('should join conditionals with ... OR ...');
                it('should return the Query Builder');
            });
        });
    });
    describe('UNION clause', () => {
        describe('union method', () => {
            describe(`(${CLASS_NAME}) signature`, () => {
                it(`should add the ${CLASS_NAME} to the UNION clause of the query`);
                it('should return the Query Builder');
            });
        });
        describe('unionAll method', () => {
            describe(`(${CLASS_NAME}) signature`, () => {
                it(`should add the ${CLASS_NAME} to the UNION clause of the query`);
                it('should return the Query Builder');
            });
        });
        describe('unionAllRaw method', () => {
            describe('(<string>, <bind = []>) signature', () => {
                it('should add "UNION ALL <string>" to the query');
                it('should add <...bind> to the bound arguments');
                it('should return the Query Builder');
            });
        });
        describe('unionRaw method', () => {
            describe('(<string>) signature', () => {
                it('should add "UNION <string>" to the query');
                it('should add <...bind> to the bound arguments');
                it('should return the Query Builder');
            });
        });
    });
    describe('ORDER BY clause', () => {
        describe('inRandomOrder method', () => {
            describe('() signature', () => {
                it('should add "ORDER BY RANDOM()" to the ORDER BY clause');
                it('should return the Query Builder');
            });
        });
        describe('orderBy method', () => {
            describe('(<field>, <ascending = true>) signature', () => {
                it('should add "<field> ASC" to the ORDER BY clause if <ascending> is true');
                it('should add "<field> DESC" to the ORDER BY clause if <ascending> is false');
                it('should return the Query Builder');
            });
        });
        describe('orderByRaw method', () => {
            describe('(<string>) signature', () => {
                it('should add "<string>" to the ORDER BY clause');
                it('should return the Query Builder');
            });
        });
    });
    describe('LIMIT clause', () => {
        describe('limit method', () => {
            describe('(<count>) signature', () => {
                it('should set the LIMIT clause to "<count>"');
                it('should add <count> to the bound arguments');
                it('should return the Query Builder');
            });
        });
        describe('take method', () => {
            describe('(<count = 1>) signature', () => {
                it('should set the LIMIT clause to "<count>"');
                it('should add <count> to the bound arguments');
                it('should return the Query Builder');
            });
        });
    });
    describe('OFFSET clause', () => {
        describe('offset method', () => {
            describe('(<count>) signature', () => {
                it('should set the OFFSET clause to "<count>"');
                it('should add <count> to the bound arguments');
                it('should return the Query Builder');
            });
        });
        describe('skip method', () => {
            describe('(<count = 1>) signature', () => {
                it('should set the OFFSET clause to "<count>"');
                it('should add <count> to the bound arguments');
                it('should return the Query Builder');
            });
        });
    });
    describe('FOR clause', () => {
        describe('lockForUpdate', () => {
            describe('(<lock = true>) signature', () => {
                it('should set the FOR UPDATE clause on the query if <lock> is true');
                it('should disable the FOR UPDATE clause on the query if <lock> is false');
                it('should return the Query Builder');
            });
        });
        describe('sharedLock method', () => {
            describe('(<lock = true>) signature', () => {
                it('should set the FOR SHARE clause on the query if <lock> is true');
                it('should disable the FOR SHARE clause on the query if <lock> is false');
                it('should return the Query Builder');
            });
        });
    });
    describe('execution methods', () => {
        describe('chunk method', () => {
            describe('(<chunk-size>) signature', () => {
                it('should return a generator-iterator');
                it('should iterate into a Promise');
                it('should resolve into a Collection');
            });
            describe('(<chunk size>, function(<collection>), <async = false>) signature', () => {
                it('should terminate if the callback returns "false"');
                it('should fetch the next set of records if the callback does not return "false"');
                it('should return the Query Builder if <async> is false');
                it('should return a Promise if <async> is true');
                it('should resolve to the Query Builder if <async> is true');
            });
        });
        describe('first method', () => {
            describe('() signature', () => {
                it('should send a request to the database');
                it('should return a Promise');
                it('should resolve to a Record');
            });
        });
        describe('get method', () => {
            describe('() signature', () => {
                it('should send a request to the database');
                it('should return a Promise');
                it('should resolve to a Collection');
            });
        });
        describe('iterator method', () => {
            describe('() signature', () => {
                it('should return a generator-iterator');
                it('should iterate into Promises');
                it('should send a request to the database on each iteration');
                it('should resolve into Records');
            });
        });
        describe('last method', () => {
            describe('(<field>) signature', () => {
                it('should send a request to the database');
                it('should add "ORDER BY <DESC>" to the query');
                it('should add "LIMIT 1" to the query');
                it('should return a Promise');
                it('should resolve to a value');
            });
        });
        describe('pluck method', () => {
            describe('(<field>) signature', () => {
                it('should return a Promise');
                it('should resolve to a Collection');
                it('should only include the <field> key in the Collection');
            });
            describe('(<field>, <alias>) signature', () => {
                it('should return a Promise');
                it('should resolve to a Collection');
                it('should only include the <alias> key in the Collection');
            });
        });
        describe('value method', () => {
            describe('(<field>) signature', () => {            
                it('should return a Promise');
                it('should resolve to a value');
            });
        });
    });
    describe('auxiliary methods', () => {
        describe('boundArguments method', () => {
            describe('() signature', () => {
                it('should return an array of all bound arguments');
            });
        });
        describe('compile method', () => {
            describe('() signature', () => {
                it('should return a string of the SQL query at compile().query', () => {
                    const query = getQueryBuilder();
                    assert.isString(query.compile().query);
                });
                it('should return an array of the bound parameters at compile().bound', () => {
                    const query = getQueryBuilder();
                    assert.isArray(query.compile().bound);
                });
            });
        });
        describe('when method', () => {
            describe('(<variable>, <onTrue:function(this)>, <onFalse:function(this) = () => {}>) signature', () => {
                it('should execute <onTrue> if <variable> is truthy');
                it('should execute <onFalse> if <variable> is falsy');
                it('should return the Query Builder');
            });
        });
    });
});
