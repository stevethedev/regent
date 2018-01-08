/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert = require('regent/lib/util/assert');
const Regent = require('regent/lib/core/regent');

const RegentEmitter = require('regent/lib/event/emitter');
const HttpKernel    = require('regent/lib/http/kernel');
const HttpRouter    = require('regent/lib/http/routing/router');
const RegentLogger  = require('regent/lib/log/logger');
const NunjucksMgr   = require('regent/lib/http/view/nunjucks-manager');

const KERNEL_TYPES  = ['http'];
const ROUTER_TYPES  = ['http'];

const { SystemConfig } = require('regent/bootstrap/system-config');

const { newRegent } = global;

const inlineRequire = require;

const CLASS_NAME   = Regent.name;

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        describe('(<sysConfig>, <appConfig>) signature', () => {
            const regent = new Regent(SystemConfig, {});
            it('should create a new instance', () => {
                assert.instanceOf(regent, Regent);
            });
            it('should register "uncaughtException" events', () => {
                assert.isTrue(
                    process.eventNames().includes('uncaughtException')
                );
            });
            it('should register "unhandledRejection" events', () => {
                assert.isTrue(
                    process.eventNames().includes('unhandledRejection')
                );
            });
            it('should register "warning" events', () => {
                assert.isTrue(process.eventNames().includes('warning'));
            });
        });
    });
    describe('start method', () => {
        const regent = newRegent();
        KERNEL_TYPES.forEach((kernelType) => {
            const kernel = regent.getKernel(kernelType);
            kernel.start = () => false;
        });
        ROUTER_TYPES.forEach((routerType) => {
            const router = regent.getRouter(routerType);
            router.load = () => false;
        });
        describe('() signature', () => {
            KERNEL_TYPES.forEach((kernelType) => {
                it(`should start the '${kernelType}' kernel`, () => {
                    let executed = false;
                    const kernel = regent.getKernel(kernelType);
                    kernel.start = () => {
                        executed = true;
                    };
                    regent.start();
                    assert.isTrue(executed);
                });
            });
            ROUTER_TYPES.forEach((routerType) => {
                it(`should load the '${routerType}' router`, () => {
                    let executed = false;
                    const router = regent.getRouter(routerType);
                    router.load = () => {
                        executed = true;
                    };
                    regent.start();
                    assert.isTrue(executed);
                });
            });
            it('should return the instance', () => {
                assert.equal(regent.start(), regent);
            });
        });
    });
    describe('stop method', () => {
        const regent = newRegent();
        KERNEL_TYPES.forEach((kernelType) => {
            const kernel = regent.getKernel(kernelType);
            kernel.stop = () => false;
        });
        ROUTER_TYPES.forEach((routerType) => {
            const router = regent.getRouter(routerType);
            router.unload = () => false;
        });
        describe('() signature', () => {
            KERNEL_TYPES.forEach((kernelType) => {
                it(`should stop the '${kernelType}' kernel`, () => {
                    let executed = false;
                    const kernel = regent.getKernel(kernelType);
                    kernel.stop = () => {
                        executed = true;
                    };
                    regent.stop();
                    assert.isTrue(executed);
                });
            });
            ROUTER_TYPES.forEach((routerType) => {
                it(`should stop the '${routerType}' router`, () => {
                    let executed = false;
                    const router = regent.getRouter(routerType);
                    router.unload = () => {
                        executed = true;
                    };
                    regent.stop();
                    assert.isTrue(executed);
                });
            });
            it('should return the instance', () => {
                assert.equal(regent.stop(), regent);
            });
        });
    });
    describe('getKernel method', () => {
        const regent = newRegent();
        KERNEL_TYPES.forEach((kernelType) => {
            describe(`('${kernelType}') signature`, () => {
                it('should return the HttpKernel', () => {
                    assert.instanceOf(regent.getKernel('http'), HttpKernel);
                });
            });
        });
        describe('(<type>) signature', () => {
            it('should return null', () => {
                assert.isNull(regent.getKernel('foo'));
            });
        });
    });
    describe('getRouter method', () => {
        const regent = newRegent();
        ROUTER_TYPES.forEach((routerType) => {
            describe(`('${routerType}') signature`, () => {
                it('should return the HttpRouter', () => {
                    assert.instanceOf(regent.getRouter('http'), HttpRouter);
                });
            });
        });
        describe('(<type>) signature', () => {
            it('should return null', () => {
                assert.isNull(regent.getRouter('foo'));
            });
        });
    });
    describe('getLogger method', () => {
        const regent = newRegent();
        describe('() signature', () => {
            it('should return the Logger', () => {
                assert.instanceOf(regent.getLogger(), RegentLogger);
            });
        });
    });
    describe('getEmitter method', () => {
        const regent = newRegent();
        describe('() signature', () => {
            it('should return the Emitter', () => {
                assert.instanceOf(regent.getEmitter(), RegentEmitter);
            });
        });
    });
    describe('getTemplater method', () => {
        const regent = newRegent();
        describe('() signature', () => {
            it('should return the Template Manager', () => {
                assert.instanceOf(regent.getTemplater(), NunjucksMgr);
            });
        });
    });
    describe('getDb method', () => {
        const PostgreSQL = inlineRequire(
            'regent/lib/db/relational/postgresql/connection'
        );
        const MySQL = inlineRequire(
            'regent/lib/db/relational/mysql/connection'
        );
        const regent = newRegent({}, {
            database: {
                connections: ['mariadb'],
                default    : 'postgres',
            },
        });
        describe('() signature', () => {
            it('should return the default Database object', () => {
                assert.instanceOf(regent.getDb().read(), PostgreSQL);
            });
        });
        describe('(<name>) signature', () => {
            it('should return the named Database object', () => {
                assert.instanceOf(regent.getDb('mysql').read(), MySQL);
            });
        });
    });
});
