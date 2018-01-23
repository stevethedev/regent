/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert     = require('regent-js/lib/util/assert');
const FileSystem = require('regent-js/lib/file/file-system');
const fs         = require('fs');
const path       = require('path');

const { Readable, Writable } = require('stream');

const CLASS_NAME = FileSystem.name;
const FOLDER_NAME = 'test-folder';
const TEST_FOLDER = path.join(__dirname, FOLDER_NAME);
const TEST_FILE   = 'test-file.txt';

// const removeSync  = (target) => fs.unlinkSync(target);

const { newRegent } = global;
const regent        = newRegent();

const { $protected } = require('regent-js/lib/util/scope').create();

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
            const fileSystem = newFileSystem();

            const FILE_NAME  = 'appendFile';
            const FILE_CONTENT = 'append file content';

            const createFile = (fileName = FILE_NAME) => fs.writeFileSync(
                path.join(TEST_FOLDER, fileName),
                '',
            );
            const fillFile   = (fileName = FILE_NAME) => fs.appendFileSync(
                path.join(TEST_FOLDER, fileName),
                FILE_CONTENT,
            );
            const deleteFile = (fileName = FILE_NAME) => fs.unlinkSync(
                path.join(TEST_FOLDER, fileName)
            );
            const readFile   = (fileName = FILE_NAME) => fs.readFileSync(
                path.join(TEST_FOLDER, fileName)
            );

            beforeEach(createFile);
            afterEach(deleteFile);

            it('should throw an error if <fileName> is not a string', () => {
                return assert.rejects(() => {
                    fileSystem.appendFile(null, FILE_CONTENT);
                });
            });
            it('should throw an error if <fileContent> is not a string', () => {
                return assert.rejects(() => {
                    fileSystem.appendFile(FILE_NAME, null);
                });
            });
            it('should return a Promise', () => {
                const promise = fileSystem.appendFile(FILE_NAME, FILE_CONTENT);
                assert.isPromise(promise);
                return Promise.resolve(promise);
            });
            it(
                'should add <fileContent> to <filePath>/<fileName> if '
                    + 'it exists',
                async () => {
                    fillFile();
                    await fileSystem.appendFile(FILE_NAME, FILE_CONTENT);
                    assert.equal(readFile(), `${FILE_CONTENT}${FILE_CONTENT}`);
                }
            );
            it(
                'should create <filePath>/<fileName> with content '
                    + '<fileContent> if it does not exist',
                async () => {
                    deleteFile();
                    await fileSystem.appendFile(FILE_NAME, FILE_CONTENT);
                    assert.equal(readFile(), FILE_CONTENT);
                }
            );
            it(
                'should resolve to true if <fileContent> is appended '
                    + 'successfully',
                async () => assert.isTrue(
                    await fileSystem.appendFile(FILE_NAME, FILE_CONTENT)
                )
            );
        });
    });
    describe('writeFile method', () => {
        describe('(<fileName>, <fileContent>) signature', () => {
            const fileSystem = newFileSystem();

            const FILE_NAME  = 'writeFile';
            const FILE_CONTENT = 'write file content';

            const createFile = (fileName = FILE_NAME) => fs.writeFileSync(
                path.join(TEST_FOLDER, fileName),
                '',
            );
            const fillFile   = (fileName = FILE_NAME) => fs.appendFileSync(
                path.join(TEST_FOLDER, fileName),
                FILE_CONTENT,
            );
            const deleteFile = (fileName = FILE_NAME) => fs.unlinkSync(
                path.join(TEST_FOLDER, fileName)
            );
            const readFile   = (fileName = FILE_NAME) => fs.readFileSync(
                path.join(TEST_FOLDER, fileName)
            );

            beforeEach(createFile);
            afterEach(deleteFile);

            it('should throw an error if <fileName> is not a string', () => {
                return assert.rejects(() => {
                    fileSystem.writeFile(null, FILE_CONTENT);
                });
            });
            it('should throw an error if <fileContent> is not a string', () => {
                return assert.rejects(() => {
                    fileSystem.writeFile(FILE_NAME, null);
                });
            });
            it('should return a Promise', () => {
                const promise = fileSystem.writeFile(FILE_NAME, FILE_CONTENT);
                assert.isPromise(promise);
                return Promise.resolve(promise);
            });
            it(
                'should reset <filePath>/<fileName> to <fileContent> if '
                    + 'it exists',
                async () => {
                    fillFile();
                    await fileSystem.writeFile(FILE_NAME, FILE_CONTENT);
                    assert.equal(readFile(), FILE_CONTENT);
                }
            );
            it(
                'should create <filePath>/<fileName> with content '
                    + '<fileContent> if it does not exist',
                async () => {
                    deleteFile();
                    await fileSystem.writeFile(FILE_NAME, FILE_CONTENT);
                    assert.equal(readFile(), FILE_CONTENT);
                }
            );
            it(
                'should resolve to true if <fileContent> is created '
                    + 'successfully',
                async () => assert.isTrue(
                    await fileSystem.writeFile(FILE_NAME, FILE_CONTENT)
                )
            );
        });
    });
    describe('removeFile method', () => {
        describe('(<fileName>) signature', () => {
            const fileSystem = newFileSystem();

            const FILE_NAME  = 'writeFile';

            const createFile = (fileName = FILE_NAME) => fs.writeFileSync(
                path.join(TEST_FOLDER, fileName),
                '',
            );
            const deleteFile = (fileName = FILE_NAME) => {
                const filePath = path.join(TEST_FOLDER, fileName);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            };
            beforeEach(createFile);
            afterEach(deleteFile);

            it('should throw an error if <fileName> is not a string', () => {
                return assert.rejects(() => {
                    return fileSystem.removeFile(null);
                });
            });
            it('should return a Promise', () => {
                const promise = fileSystem.removeFile(FILE_NAME);
                assert.isPromise(promise);
                return promise;
            });
            it('should remove the file at <filePath>/<fileName>', async () => {
                await fileSystem.removeFile(FILE_NAME);
                assert.isFalse(
                    fs.existsSync(
                        path.join(TEST_FOLDER, FILE_NAME)
                    )
                );
            });
            it(
                'should resolve to true if <filePath>/<fileName> is removed',
                async () => {
                    assert.isTrue(await fileSystem.removeFile(FILE_NAME));
                }
            );
        });
    });
    describe('copyFile method', () => {
        describe('(<fromFile>, <toFile>) signature', () => {
            const fileSystem = newFileSystem();

            const FILE_NAME  = 'copyFile';

            const createFile = (fileName = FILE_NAME) => fs.writeFileSync(
                path.join(TEST_FOLDER, fileName),
                '',
            );
            const deleteFile = (fileName = FILE_NAME) => {
                const filePath = path.join(TEST_FOLDER, fileName);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            };
            beforeEach(deleteFile);
            afterEach(deleteFile);

            it('should throw an error if <fromFile> is not a string', () => {
                assert.rejects(() => fileSystem.copyFile(null, FILE_NAME));
            });
            it('should throw an error if <toFile> is not a string', () => {
                assert.rejects(() => fileSystem.copyFile(TEST_FILE, null));
            });
            it(
                'should throw an error if <filePath>/<fromFile> does not exist',
                () => {
                    return assert.rejects(() => fileSystem.copyFile(
                        `${TEST_FILE}-`,
                        FILE_NAME,
                    ));
                }
            );
            it(
                'should throw an error if <filePath>/<toFile> already exists',
                () => {
                    createFile();
                    assert.rejects(() => fileSystem.copyFile(
                        TEST_FILE,
                        FILE_NAME,
                    ));
                }
            );
            it('should return a Promise', () => {
                const promise = fileSystem.copyFile(TEST_FILE, FILE_NAME);
                assert.isPromise(promise);
                return promise;
            });
            it('should resolve to true', async () => {
                assert.isTrue(await fileSystem.copyFile(TEST_FILE, FILE_NAME));
            });
        });
    });
    describe('getFileSize method', () => {
        describe('(<fileName>) method', () => {
            const fileSystem = newFileSystem();
            it('should throw an error if <fileName> is not a string', () => {
                return assert.rejects(() => fileSystem.getFileSize(null));
            });
            it('should return a Promise', () => {
                const promise = fileSystem.getFileSize(TEST_FILE);
                assert.isPromise(promise);
                return promise;
            });
            it(
                'should resolve to 0 <filePath>/<fileName> does not exist',
                async () => {
                    assert.equal(
                        await fileSystem.getFileSize(`${TEST_FILE}-`),
                        0,
                    );
                }
            );
            it(
                'should resolve to the file-size of <filePath>/<fileName>',
                async () => {
                    assert.equal(
                        await fileSystem.getFileSize(TEST_FILE),
                        fs.statSync(path.join(TEST_FOLDER, TEST_FILE)).size,
                    );
                }
            );
        });
    });
    describe('readFile method', () => {
        describe('(<fileName>) signature', () => {
            const fileSystem = newFileSystem();
            it('should throw an error if <fileName> is not a string', () => {
                return assert.rejects(() => fileSystem.readFile(null));
            });
            it('should return a Promise', () => {
                const promise = fileSystem.readFile(TEST_FILE);
                assert.isPromise(promise);
                return promise;
            });
            it(
                'should throw an error if <filePath>/<fileName> does '
                    + 'not exist',
                () => {
                    return assert.rejects(() => {
                        return fileSystem.readFile(`${TEST_FILE}-`);
                    });
                }
            );
            it(
                'should resolve to a string if <filePath>/<fileName> exists',
                async () => {
                    assert.equal(
                        await fileSystem.readFile(TEST_FILE),
                        fs.readFileSync(path.join(TEST_FOLDER, TEST_FILE)),
                    );
                }
            );
        });
    });
    describe('readStream method', () => {
        describe('(<fileName>, <writeStream>) signature', () => {
            const fileSystem = newFileSystem();
            function getStream() {
                const writer = new Writable();
                const data = [];
                // eslint-disable-next-line no-underscore-dangle
                writer._write = (content) => data.push(content.toString());
                writer.on('error', (err) => {
                    throw err;
                });
                return {
                    data,
                    writer,
                };
            }

            it('should throw an error if <fileName> is not a string', () => {
                const { writer } = getStream();
                return assert.rejects(() => {
                    return fileSystem.readStream(null, writer);
                });
            });
            it('should return a Promise', () => {
                const { writer } = getStream();
                const promise = fileSystem.readStream(TEST_FILE, writer);
                assert.isPromise(promise);
                return promise;
            });
            it(
                'should throw an error if <filePath>/<fileName> does not exist',
                () => {
                    const { writer } = getStream();
                    return assert.rejects(() => {
                        return fileSystem.readStream(`${TEST_FILE}-`, writer);
                    });
                }
            );
            it('should resolve to the number of bytes read', async () => {
                const { data, writer } = getStream();
                assert.equal(
                    await fileSystem.readStream(TEST_FILE, writer),
                    data.join('').length,
                );
            });
        });
    });
    describe('writeStream method', () => {
        describe('(<fileName>, <readStream>) signature', () => {
            const fileSystem = newFileSystem();
            const fakeFile = 'writeStream';

            afterEach(() => {
                const fileName = path.join(TEST_FOLDER, fakeFile);
                if (fs.existsSync(fileName)) {
                    fs.unlinkSync(fileName);
                }
            });

            function getStream() {
                const reader = fs.createReadStream(
                    path.join(TEST_FOLDER, TEST_FILE)
                );
                const data = [];
                // eslint-disable-next-line no-underscore-dangle
                reader.on('error', (err) => {
                    throw err;
                });
                reader.on('data', (chunk) => data.push(chunk));
                return {
                    data,
                    reader,
                };
            }

            it('should throw an error if <fileName> is not a string', () => {
                const { reader } = getStream();
                return assert.rejects(() => {
                    return fileSystem.writeStream(null, reader);
                });
            });
            it('should return a Promise', () => {
                const { reader } = getStream();
                const promise = fileSystem.writeStream(fakeFile, reader);
                assert.isPromise(promise);
                return promise;
            });
            it(
                'should throw an error if <filePath>/<fileName> exists',
                () => {
                    const { reader } = getStream();
                    fs.writeFileSync(path.join(TEST_FOLDER, fakeFile));
                    return assert.rejects(() => {
                        return fileSystem.writeStream(fakeFile, reader);
                    });
                }
            );
            it('should resolve to the number of bytes written', async () => {
                const { data, reader } = getStream();
                assert.equal(
                    await fileSystem.writeStream(fakeFile, reader),
                    data.join('').length,
                );
            });
        });
    });
});
