/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const DbSchema    = require('regent-js/lib/db/schema/db');
const FieldSchema = require('regent-js/lib/db/schema/field');
const TableSchema = require('regent-js/lib/db/schema/table');

const CLASS_NAME  = FieldSchema.name;

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        describe('(<tableSchema>, <name>, <type>) signature', () => {
            it('should set the field name');
            it('should set the field type');
            it(`should return a new ${CLASS_NAME}`);
        });
    });
    describe('putAfter method', () => {
        describe('(<column>) signature', () => {
            it(`should queue the ${CLASS_NAME} to insert after <column>`);
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('setAutoIncrement method', () => {
        describe('() signature', () => {
            it(`should set the ${CLASS_NAME} to auto-increment`);
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('setCharset method', () => {
        describe('(<charset>) signature', () => {
            it('should set the character-set');
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('setCollation method', () => {
        describe('(<collation>) signature', () => {
            it('should set the collation');
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('setComment method', () => {
        describe('(<text>) signature', () => {
            it('should set the comment');
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('setDefault method', () => {
        describe('(<value>) signature', () => {
            it('should set the default value for the field');
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('putFirst method', () => {
        describe('() signature', () => {
            it('should move the field to the front of the list');
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('setNullable method', () => {
        describe('() signature', () => {
            it('should set the field to be nullable');
            it(`should return the ${CLASS_NAME}`);
        });
        describe('(<nullable>) signature', () => {
            it('should set the field to be nullable if <nullable> is truthy');
            it('should set the field as non-nullable if <nullable> is falsy');
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('storeAs method', () => {
        describe('(<expression>) signature', () => {
            it('should use <expression> to create a composite column');
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('setUnsigned method', () => {
        describe('() signature', () => {
            it('should set the field to be unsigned if it is numerical');
            it(`should return the ${CLASS_NAME}`);
        });
        describe('(<unsigned>) signature', () => {
            it('should set the field to be unsigned if <unsigned> is truthy');
            it('should set the field to be signed if <unsigned> is falsy');
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('useCurrent method', () => {
        describe('() signature', () => {
            it('should default to the current time when inserting records');
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('virtualAs method', () => {
        describe('(<expression>) signature', () => {
            it('should set a virtual column');
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('setReference method', () => {
        describe('(<column>) signature', () => {
            it('should set a foreign key on <column>');
            it(`should return the ${CLASS_NAME}`);
        });
        describe('(<column>, <table>) signature', () => {
            it('should set a foreign key on <table>.<column>');
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('onDelete', () => {
        describe('(<action>) signature', () => {
            it('should cascade if <action> is "CASCADE"');
            it('should nullify if <action> is "NULL"');
            it('should set defaults if <action> is "DEFAULT"');
            it('should throw an error if <action> is not recognized');
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('onUpdate', () => {
        describe('(<action>) signature', () => {
            it('should set the cascade-action to <action>');
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('cascadeOnDelete', () => {
        describe('() signature', () => {
            it('should cascade deletions');
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('nullOnDelete', () => {
        describe('() signature', () => {
            it('should nullify on delete');
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('defaultOnDelete', () => {
        describe('() signature', () => {
            it('should set defaults on deletions');
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('cascadeOnUpdate', () => {
        describe('() signature', () => {
            it('should cascade on update');
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('nullOnUpdate', () => {
        describe('() signature', () => {
            it('should nullify on update');
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('defaultOnUpdate', () => {
        describe('() signature', () => {
            it('should set defaults on update');
            it(`should return the ${CLASS_NAME}`);
        });
    });
});
