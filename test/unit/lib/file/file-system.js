/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert     = require('regent-js/lib/util/assert');
const FileSystem = require('regent-js/lib/file/file-system');
const fs         = require('fs');
const path       = require('path');

const CLASS_NAME = FileSystem.name;
const FOLDER_NAME = 'test-folder';
const TEST_FOLDER = path.join(__dirname, FOLDER_NAME);
const TEST_FILE   = 'test-file.txt';

const removeSync  = (target) => fs.unlinkSync(target);

const { newRegent } = global;
const regent        = newRegent();

const { $protected } = require('regent-js/lib/util/scope')();

const newFileSystem = (filePath = TEST_FOLDER) => {
    return new FileSystem(regent, filePath);
};


describe(`The ${CLASS_NAME} class`, () => {
    describe('constructor method', () => {
        describe('(<regent>, <filePath>) signature', () => {
            it('should throw an error if <filePath> is not a string', () => {
                assert.throws(() => newFileSystem(null));
            });
            it('should spread relative paths into absolute paths', () => {
                const fileSystem = newFileSystem('.');
                const { filePath } = $protected(fileSystem);
                assert.notEqual(filePath, '.');
                assert.equal(filePath, path.resolve('.'));
            });
        });
    });
    describe('fileExists method', () => {
        const fileSystem = newFileSystem();
        describe('(<fileName>) signature', () => {
            it('should return a Promise', () => {
                assert.isPromise(fileSystem.fileExists(TEST_FILE));
            });
            it('should throw an error if <fileName> is not a string', () => {
                return assert.rejects(() => fileSystem.fileExists());
            });
            it(
                'should resolve to true if <fileName> exists in <filePath>',
                () => {
                    const promise = fileSystem.fileExists(TEST_FILE);
                    return assert.resolveTo(promise, true);
                }
            );
            it(
                'should resolve to false if <fileName> does not exist '
                    + 'in <filePath>',
                () => {
                    const promise = fileSystem.fileExists(`${TEST_FILE}-`);
                    return assert.resolveTo(promise, false);
                }
            );
            it('should not allow navigation out of <filePath>', () => {
                const promise = fileSystem.fileExists(`../${TEST_FILE}`);
                return assert.resolveTo(promise, false);
            });
        });
    });
    describe('dirExists method', () => {
        describe('() signature', () => {
            const fileSystem = newFileSystem();
            it('should return a Promise', () => {
                assert.isPromise(fileSystem.dirExists());
            });
            it('should resolve to true if <filePath> directory exists', () => {
                return assert.resolveTo(fileSystem.dirExists(), true);
            });
            it(
                'should resolve to false if <filePath> directory does '
                    + 'not exist',
                () => {
                    const system = newFileSystem(
                        path.join(TEST_FOLDER, 'foo', 'bar', 'baz')
                    );
                    return assert.resolveTo(system.dirExists(), false);
                }
            );
        });
        describe('(<dirName>) signature', () => {
            const fileSystem = newFileSystem(__dirname);
            it('should return a Promise', () => {
                assert.isPromise(fileSystem.dirExists(FOLDER_NAME));
            });
            it('should not allow navigation out of <filePath>', () => {
                return assert.resolveTo(fileSystem.dirExists('..'), false);
            });
            it(
                'should resolve to true if <dirName> exists in <filePath>',
                () => {
                    return assert.resolveTo(
                        fileSystem.dirExists(FOLDER_NAME),
                        true
                    );
                }
            );
            it(
                'should resolve to false if <dirName> does not exist '
                    + 'in <filePath>',
                () => {
                    return assert.resolveTo(
                        fileSystem.dirExists(`${FOLDER_NAME}-`),
                        false
                    );
                }
            );
        });
    });
    describe('createDir method', () => {
        describe('() signature', () => {
            const fileSystem = newFileSystem(TEST_FOLDER);
            it('should return a Promise', () => {
                assert.isPromise(fileSystem.createDir());
            });
            it('should resolve to true if <filePath> exists', () => {
                return assert.resolveTo(fileSystem.createDir(), true);
            });
            it('should throw an error if <filePath> does not exist', () => {
                const system = newFileSystem(path.join(__dirname, 'foo'));
                return assert.rejects(() => system.createDir());
            });
        });
        describe('(<dirName>) signature', () => {
            const NEW_FOLDER = 'foo-bar';
            const fileSystem = newFileSystem(TEST_FOLDER);
            const clear = () => {
                try {
                    fs.rmdirSync(path.join(TEST_FOLDER, NEW_FOLDER));
                } catch (err) {
                    // Do nothing
                }
                return true;
            };

            beforeEach(clear);
            after(clear);

            it('should return a Promise', () => {
                const promise = fileSystem.createDir(NEW_FOLDER);
                assert.isPromise(promise);
                return promise;
            });
            it('should not allow navigation out of <filePath>');
            it(
                'should resolve to true if <dirName> exists in <filePath>',
                () => {
                    try {
                        fs.mkdirSync(path.join(TEST_FOLDER, NEW_FOLDER));
                    } catch (err) {
                        // Do nothing
                    }
                    const promise = fileSystem.createDir(NEW_FOLDER);
                    return assert.resolveTo(promise, true);
                }
            );
            it(
                'should resolve to true if <filePath> is created in <dirName>',
                () => {
                    const promise = fileSystem.createDir(NEW_FOLDER);
                    return assert.resolveTo(promise, true);
                }
            );
            it(
                'should throw an error if <dirName> could not be created '
                    + 'in <filePath>',
                () => {
                    return assert.rejects(() => {
                        return fileSystem.createDir(TEST_FILE);
                    });
                }
            );
            it('should throw an error if <filePath> does not exist', () => {
                const system = newFileSystem(
                    path.join(TEST_FOLDER, 'foo', 'bar', 'baz')
                );
                return assert.rejects(() => system.createDir(TEST_FOLDER));
            });
        });
    });
    describe('appendFile method', () => {
        describe('(<fileName>, <fileContent>) signature', () => {
            it('should throw an error if <fileName> is not a string');
            it('should throw an error if <fileContent> is not a string');
            it('should add <fileContent> to <filePath>/<fileName> if it exists');
            it('should create <filePath>/<fileName> with content <fileContent> if it does not exist');
            it('should return a Promise');
            it('should not allow navigation out of <filePath>');
            it('should resolve to true if <fileContent> is appended successfully');
            it('should resolve to false if <fileContent> fails to append');
        });
    });
    describe('writeFile method', () => {
        describe('(<fileName>, <fileContent>) signature', () => {
            it('should throw an error if <fileName> is not a string');
            it('should throw an error if <fileContent> is not a string');
            it('should reset <filePath>/<fileName> to <fileContent> if it exists');
            it('should create <filePath>/<fileName> with content <fileContent> if it does not exist');
            it('should return a Promise');
            it('should not allow navigation out of <filePath>');
            it('should resolve to true if <fileContent> is appended successfully');
            it('should resolve to false if <fileContent> fails to append');
        });
    });
    describe('removeFile method', () => {
        describe('(<fileName>) signature', () => {
            it('should throw an error if <fileName> is not a string');
            it('should return a Promise');
            it('should not allow navigation out of <filePath>');
            it('should remove the file at <filePath>/<fileName>');
            it('should resolve to true if <filePath>/<fileName> is removed');
            it('should resolve to false if <filePath>/<fileName> is not removed');
        });
    });
    describe('copyFile method', () => {
        describe('(<fromFile>, <toFile>) signature', () => {
            it('should throw an error if <fromFile> is not a string');
            it('should throw an error if <toFile> is not a string');
            it('should throw an error if <filePath>/<fromFile> does not exist');
            it('should throw an error if <filePath>/<toFile> already exists');
            it('should return a Promise');
            it('should not allow navigation out of <filePath>');
            it('should resolve to true');
        });
    });
    describe('getFileSize method', () => {
        describe('(<fileName>) method', () => {
            it('should throw an error if <fileName> is not a string');
            it('should return a Promise');
            it('should not allow navigation out of <filePath>');
            it('should resolve to 0 <filePath>/<fileName> does not exist');
            it('should resolve to the file-size of <filePath>/<fileName>');
        });
    });
    describe('readFile method', () => {
        describe('(<fileName>) signature', () => {
            it('should throw an error if <fileName> is not a string');
            it('should return a Promise');
            it('should not allow navigation out of <filePath>');
            it('should resolve to null if <filePath>/<fileName> does not exist');
            it('should resolve to a string if <filePath>/<fileName> exists');
        });
    });
    describe('readStream method', () => {
        describe('(<fileName>, <writeStream>) signature', () => {
            it('should throw an error if <fileName> is not a string');
            it('should return a Promise');
            it('should not allow navigation out of <filePath>');
            it('should throw an error if <filePath>/<fileName> does not exist');
            it('should resolve to the number of bytes read');
        });
    });
    describe('writeStream method', () => {
        describe('(<fileName>, <readStream>) signature', () => {
            it('should throw an error if <fileName> is not a string');
            it('should return a Promise');
            it('should not allow navigation out of <filePath>');
            it('should resolve to the number of bytes written');
        });
    });
});
