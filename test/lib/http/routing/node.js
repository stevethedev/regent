/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const HttpRoutingNode = requireLib('http/routing/node');
const assert       = requireLib('util/assert');

const CLASS_NAME   = HttpRoutingNode.name;

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        it('should throw an array if a non-string segment is provided', () => {
            assert.throws(() => new HttpRoutingNode(true));
        });
        it('should accept a segment value as a parameter', () => {
            const SEGMENT = 'foo';
            const node = new HttpRoutingNode(SEGMENT);
            assert.equal(node.__segment, SEGMENT);
        });
        it('should provide a default segment value of "index"', () => {
            const SEGMENT = 'index';
            const node = new HttpRoutingNode();
            assert.equal(node.__segment, SEGMENT);
        });
        it('should accept a resource object as a parameter');
        it('should default an empty resource to "null"', () => {
            const node = new HttpRoutingNode();
            assert.isNull(node.__resource);
        });
    });
    describe('segment', () => {
        it('should be settable', () => {
            const SEGMENT = 'foo';
            const node = new HttpRoutingNode();
            assert.notEqual(node.__segment, SEGMENT);
            node.setSegment(SEGMENT);
            assert.equal(node.__segment, SEGMENT);
        });
        it('should be gettable', () => {
            const SEGMENT = 'foo';
            const node = new HttpRoutingNode();
            assert.notEqual(node.getSegment(), SEGMENT);
            node.__segment = SEGMENT;
            assert.equal(node.getSegment(), SEGMENT);
        });
        it('should throw an error if a non-string segment is assigned', () => {
            const node = new HttpRoutingNode();
            assert.throws(() => node.setSegment(true));
        });
    });
    describe('variable patterns', () => {
        it('should be settable', () => {
            const VAR_NAME = 'foo';
            const VAR_PATTERN = '[a-z0-9]+';
            const node = new HttpRoutingNode();
            assert(!node.__variables.has(VAR_NAME));
            node.setVariablePattern(VAR_NAME, VAR_PATTERN);
            assert(node.__variables.has(VAR_NAME));
            assert.equal(node.__variables.get(VAR_NAME), VAR_PATTERN);
        });
        it('should be gettable', () => {
            const VAR_NAME = 'foo';
            const VAR_PATTERN = '[a-z0-9]+';
            const node = new HttpRoutingNode();
            assert(!node.__variables.has(VAR_NAME));
            node.__variables.set(VAR_NAME, VAR_PATTERN);
            assert.equal(node.getVariablePattern(VAR_NAME), VAR_PATTERN);
        });
        it('should default to \\w+', () => {
            const VAR_NAME = 'foo';
            const VAR_PATTERN = '\\w+';
            const node = new HttpRoutingNode();
            assert(!node.__variables.has(VAR_NAME));
            assert.equal(node.getVariablePattern(VAR_NAME), VAR_PATTERN);
        });
        it('should throw an error if a non-string variable name is provided', () => {
            const node = new HttpRoutingNode();
            assert.throws(() => node.setVariablePattern(true));
        });
        it('should throw an error if a non-string pattern is assigned', () => {
            const node = new HttpRoutingNode();
            assert.throws(() => node.setVariablePattern('foo', true));
        });
    });
    describe('resource', () => {
        it('should be settable');
        it('should be gettable');
    });
    describe('case-sensitivity', () => {
        it('should be settable', () => {
            const node = new HttpRoutingNode();
            node.setCaseSensitive(true);
            assert.isTrue(node.__caseSensitive);
            node.setCaseSensitive(false);
            assert.isFalse(node.__caseSensitive);
        });
        it('should be gettable', () => {
            const node = new HttpRoutingNode();
            node.__caseSensitive = true;
            assert.isTrue(node.getCaseSensitive());
            node.__caseSensitive = false;
            assert.isFalse(node.getCaseSensitive());
        });
        it('should throw an error if a non-boolean value is assigned', () => {
            const node = new HttpRoutingNode();
            assert.throws(() => node.setCaseSensitive('foo'));
        });
    });
});
