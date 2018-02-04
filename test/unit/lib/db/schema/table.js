/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const DbSchema    = require('regent-js/lib/db/schema/db');
const FieldSchema = require('regent-js/lib/db/schema/field');
const TableSchema = require('regent-js/lib/db/schema/table');

const CLASS_NAME  = TableSchema.name;

describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor', () => {
        describe('(<connection>, <name>) signature', () => {
            it(`should return a ${CLASS_NAME} instance`);
            it('should set the connection to <connection>');
            it('should set the table name to <name>');
        });
    });
    describe('hasConfig method', () => {
        describe('(<name>) signature', () => {
            it('should return TRUE if the config value <name> exists');
            it('should return FALSE if the config value <name> does not exist');
        });
    });
    describe('getConfig method', () => {
        describe('(<name>) signature', () => {
            it('should return the config value for <name>');
            it('should return NULL if no value exists');
        });
        describe('(<name>, <default>)', () => {
            it('should return the config value for <name>');
            it('should return <default> if no value exists');
        });
    });
    describe('setConfig method', () => {
        describe('(<name>, <value>) signature', () => {
            it('should set the config for <name> to equal <value>');
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('addField method', () => {
        describe('(<name>, <instance>) signature', () => {
            it('should add a field named <name>');
            it('should set the field instance to <instance>');
            it(`should return the ${CLASS_NAME}`);
        });
    });
    describe('setTemporary method', () => {
        describe('() signature', () => {
            it(`should return the ${CLASS_NAME} instance`);
            it('should set the table to be temporary');
        });
        describe('(<isTemporary>) signature', () => {
            it(`should return the ${CLASS_NAME} instance`);
            it('should set the temporary state to <isTemporary>');
        });
    });
    describe('addBigIncrement method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a BIGINTEGER field to the query');
            it('should set the field to AUTOINCREMENT');
            it('should set the field name to <name>');
        });
    });
    describe('addBigInteger method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a BIGINTEGER field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addBinary method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a BINARY field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addBoolean method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a BOOLEAN field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addChar method', () => {
        describe('(<name>, <size>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a CHAR field to the query');
            it('should set the field name to <name>');
            it('should set the field size to <size>');
        });
    });
    describe('addDate method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a DATE field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addDateTime method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a DATETIME field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addDateTimeTz method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a DATETIME field to the query');
            it('should add timezones to the field');
            it('should set the field name to <name>');
        });
    });
    describe('addDecimal method', () => {
        describe('(<name>, <precision>, <scale>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a DECIMAL field to the query');
            it('should set the field name to <name>');
            it('should set the field precision to <precision>');
            it('should set the field scale to <scale>');
        });
        describe('(<name>, <precision>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a DECIMAL field to the query');
            it('should set the field name to <name>');
            it('should set the field precision to <precision>');
        });
    });
    describe('addDouble method', () => {
        describe('(<name>, <precision>, <scale>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a DOUBLE field to the query');
            it('should set the field name to <name>');
            it('should set the field precision to <precision>');
            it('should set the field scale to <scale>');
        });
        describe('(<name>, <precision>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a DOUBLE field to the query');
            it('should set the field name to <name>');
            it('should set the field precision to <precision>');
        });
    });
    describe('addEnum method', () => {
        describe('(<name>, <values[]>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an ENUM field to the query');
            it('should set the ENUM values to <values[]>');
            it('should set the field name to <name>');
        });
    });
    describe('addFloat method', () => {
        describe('(<name>, <precision>, <scale>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a FLOAT field to the query');
            it('should set the field name to <name>');
            it('should set the precision to <precision>');
            it('should set the scale to <scale>');
        });
        describe('(<name>, <precision>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a FLOAT field to the query');
            it('should set the field name to <name>');
            it('should set the precision to <precision>');
        });
    });
    describe('addGeometry method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a GEOMETRY field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addGeometryCollection method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a GEOMETRYCOLLECTION field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addIncrements method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an INTEGER field to the query');
            it('should set the INTEGER field to AUTOINCREMENT');
            it('should set the field name to <name>');
        });
    });
    describe('addInteger method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an INTEGER field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addIpAddress method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an INET field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addJson method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a JSON field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addJsonb method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a JSONB field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addLineString method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a LINESTRING field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addLongText method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a LONGTEXT field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addMacAddress method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a MACADDR field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addMediumIncrement method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a MEDIUM INTEGER field to the query');
            it('should add AUTOINCREMENT to the MEDIUM INTEGER field');
            it('should set the field name to <name>');
        });
    });
    describe('addMediumInteger method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a MEDIUM INTEGER field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addMediumText method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a MEDIUMTEXT field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addMorphs method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an UNSIGNED INTEGER field to the query');
            it('should set the UNSIGNED INTEGER name to "<name>_id"');
            it('should add a VARCHAR field to the query');
            it('should set the VARCHAR field name to "<name>_type"');
        });
    });
    describe('addMultilineString method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a MULTILINESTRING field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addMultiPoint method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a MULTIPOINT field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addMultiPolygon method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a MULTIPOLYGON field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addNullableMorphs method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an UNSIGNED INTEGER field to the query');
            it('should set the UNSIGNED INTEGER name to "<name>_id"');
            it('should set the UNSIGNED INTEGER field to be nullable');
            it('should add a VARCHAR field to the query');
            it('should set the VARCHAR field name to "<name>_type"');
            it('should set the VARCHAR field to be nullable');
        });
    });
    describe('addPoint method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a POINT field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addPolygon method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a POLYGON field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addSmallIncrement method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a SMALL INTEGER field to the query');
            it('should set the field to AUTOINCREMENT');
            it('should set the field name to <name>');
        });
    });
    describe('addSmallInteger method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a SMALL INTEGER field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addSoftDeletes method', () => {
        describe('() signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an TIMESTAMP field to the query');
            it('should set the field name to "deleted_at"');
            it('should allow "deleted_at" to be null');
        });
    });
    describe('addSoftDeletesTz method', () => {
        describe('() signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a TIMESTAMP field to the query');
            it('should add timezone support to the field');
            it('should set the field name to "deleted_at"');
            it('should allow "deleted_at" to be NULL');
        });
    });
    describe('addString method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an VARCHAR field to the query');
            it('should set the field name to <name>');
        });
        describe('(<name>, <size>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an VARCHAR field to the query');
            it('should set the field name to <name>');
            it('should set the field size to <size>');
        });
    });
    describe('addText method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an TEXT field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addTime method', () => {
        describe('(<name>, <precision>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an TIME field to the query');
            it('should add timezone support to the field');
            it('should set the field name to <name>');
            it('should add a precision to the field');
        });
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an TIME field to the query');
            it('should add timezone support to the field');
            it('should set the field name to <name>');
        });
    });
    describe('addTimeTz method', () => {
        describe('(<name>, <precision>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an TIME field to the query');
            it('should add timezone support to the field');
            it('should set the field name to <name>');
            it('should add a precision to the field');
        });
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an TIME field to the query');
            it('should add timezone support to the field');
            it('should set the field name to <name>');
        });
    });
    describe('addTimestamp method', () => {
        describe('(<name>, <precision>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an TIMESTAMP field to the query');
            it('should add a precision to the field');
            it('should set the field name to <name>');
        });
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an TIMESTAMP field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addTimestampTz method', () => {
        describe('(<name>, <precision>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an TIMESTAMP field to the query');
            it('should add timezone support to the field');
            it('should add a precision to the field');
            it('should set the field name to <name>');
        });
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an TIMESTAMP field to the query');
            it('should add timezone support to the field');
            it('should set the field name to <name>');
        });
    });
    describe('addTinyIncrement method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an TINY INTEGER field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addTinyInteger method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an TINY INTEGER field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addUnsignedBigInteger method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an UNSIGNED BIG INTEGER field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addUnsignedDecimal method', () => {
        describe('(<name>, <precision>, <scale>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an UNSIGNED DECIMAL field to the query');
            it('should set the field name to <name>');
            it('should set the precision to <precision>');
            it('should set the scale to <scale>');
        });
        describe('(<name>, <precision>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an UNSIGNED DECIMAL field to the query');
            it('should set the field name to <name>');
            it('should set the precision to <precision>');
            it('should omit the scale');
        });
    });
    describe('addUnsignedInteger method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an UNSIGNED INTEGER field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addUnsignedMediumInteger method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an UNSIGNED MEDIUM INTEGER field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addUnsignedSmallInteger method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an UNSIGNED SMALL INTEGER field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addUnsignedTinyInteger method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add an UNSIGNED TINY INTEGER field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addUuid method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a UUID field to the query');
            it('should set the field name to <name>');
        });
    });
    describe('addYear method', () => {
        describe('(<name>) signature', () => {
            it(`should return a ${FieldSchema.name} instance`);
            it('should add a YEAR field to the query');
            it('should set the field name to <name>');
        });
    });
});
