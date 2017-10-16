/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = requireLib('util/assert');
const HttpSegment  = requireLib('http/routing/segment');

const HTTP_PATH = 'a/b/c';
const HTTP_SEGMENTS = HTTP_PATH.split('/');

describe(`The ${HttpSegment.name} class`, () => {
    it('should be instantiable', () => {
        const rootSegment = new HttpSegment();
        assert.instanceOf(rootSegment, HttpSegment);
    });

    describe(`${HttpSegment.name}::addRoute()`, () => {
        let childSegment = null;
        before(() => {
            const rootSegment = new HttpSegment();
            childSegment = rootSegment.addRoute(HTTP_SEGMENTS);
        });
        it(`should let me create new ${HttpSegment.name} instances`, () => {
            assert.instanceOf(childSegment, HttpSegment);
        });
    });

    describe(`${HttpSegment.name}::matches()`, () => {
        describe('with string literals', () => {
            it('should return TRUE if the match passes', () => {
                const SEGMENT_TEXT = 'test';
                const segment = new HttpSegment(SEGMENT_TEXT);
                assert.isTrue(segment.matches(SEGMENT_TEXT));
            });
            it('should return FALSE if the match fails', () => {
                const SEGMENT_TEXT = 'test';
                const segment = new HttpSegment(SEGMENT_TEXT);
                assert.isFalse(segment.matches(`${SEGMENT_TEXT}a`));
            });
        });
        describe('with required variables', () => {
            it('should return TRUE if the match passes', () => {
                const SEGMENT_TEXT = 'foo-{foo}';
                const SEGMENT_TRIAL = 'foo-bar';
                const segment = new HttpSegment(SEGMENT_TEXT);
                assert.isTrue(segment.matches(SEGMENT_TRIAL));
            });
            it('should return FALSE if the match fails', () => {
                const SEGMENT_TEXT = 'foo-{foo}';
                const SEGMENT_TRIAL = 'bar-bar';
                const segment = new HttpSegment(SEGMENT_TEXT);
                assert.isFalse(segment.matches(SEGMENT_TRIAL));
            });
            it('should return FALSE if the variable is missing', () => {
                const SEGMENT_TEXT = 'foo-{foo}';
                const SEGMENT_TRIAL = 'foo-';
                const segment = new HttpSegment(SEGMENT_TEXT);
                assert.isFalse(segment.matches(SEGMENT_TRIAL));
            });
        });
        describe('with optional variables', () => {
            it('should return TRUE if the match passes', () => {
                const SEGMENT_TEXT = 'foo-{foo?}';
                const SEGMENT_TRIAL = 'foo-bar';
                const segment = new HttpSegment(SEGMENT_TEXT);
                assert.isTrue(segment.matches(SEGMENT_TRIAL));
            });
            it('should return FALSE if the match fails', () => {
                const SEGMENT_TEXT = 'foo-{foo?}';
                const SEGMENT_TRIAL = 'bar-bar';
                const segment = new HttpSegment(SEGMENT_TEXT);
                assert.isFalse(segment.matches(SEGMENT_TRIAL));
            });
            it('should return TRUE if the variable is missing', () => {
                const SEGMENT_TEXT = 'foo-{foo?}';
                const SEGMENT_TRIAL = 'foo-';
                const segment = new HttpSegment(SEGMENT_TEXT);
                assert.isTrue(segment.matches(SEGMENT_TRIAL));
            });
        });
    });

    describe(`${HttpSegment.name}::getSegment()`, () => {
        it('should return a reference to a created segment if it exists', () => {
            const rootSegment = new HttpSegment();
            const childSegment = rootSegment.addRoute(HTTP_SEGMENTS);
            assert.equal(rootSegment.getSegment(HTTP_SEGMENTS), childSegment);
        });
        it('should return NULL if an invalid segment is provided', () => {
            const rootSegment = new HttpSegment();
            assert.isNull(rootSegment.getSegment(HTTP_SEGMENTS));
        });
        it('should load required parameter variables into the second parameter', () => {
            const SEGMENT_TEXT = 'foo-{foo}/bar-{bar}';
            const SEGMENT_TRIAL = 'foo-bar/bar-baz';
            const variableMap = new Map();
            const rootSegment = new HttpSegment();
            rootSegment.addRoute(SEGMENT_TEXT.split('/'));
            rootSegment.getSegment(SEGMENT_TRIAL.split('/'), variableMap);
            assert.equal(variableMap.get('foo'), 'bar');
            assert.equal(variableMap.get('bar'), 'baz');
        });
        it('should load optional parameter variables into the second parameter', () => {
            const SEGMENT_TEXT = 'foo-{foo?}/bar-{bar?}';
            const SEGMENT_TRIAL = 'foo-bar/bar-baz';
            const variableMap = new Map();
            const rootSegment = new HttpSegment();
            rootSegment.addRoute(SEGMENT_TEXT.split('/'));
            rootSegment.getSegment(SEGMENT_TRIAL.split('/'), variableMap);
            assert.equal(variableMap.get('foo'), 'bar');
            assert.equal(variableMap.get('bar'), 'baz');
        });
        it('should omit missing optional parameter variables into the second parameter', () => {
            const SEGMENT_TEXT = 'foo-{foo?}/bar-{bar?}';
            const SEGMENT_TRIAL = 'foo-/bar-';
            const variableMap = new Map();
            const rootSegment = new HttpSegment();
            rootSegment.addRoute(SEGMENT_TEXT.split('/'));
            rootSegment.getSegment(SEGMENT_TRIAL.split('/'), variableMap);
            assert.isUndefined(variableMap.get('foo'));
            assert.isUndefined(variableMap.get('bar'));
        });
    });
});
