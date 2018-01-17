/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = require('regent-js/lib/util/assert');
const fs           = require('fs');
const path         = require('path');
const RegentObject = require('regent-js/lib/util/regent-object');
const { $protected } = require('regent-js/lib/util/scope')();

class FileSystem extends RegentObject {
    /**
     * Represent an internal file-system for Regent
     *
     * @param {Regent} regent
     * @param {String} filePath
     */
    constructor(regent, filePath) {
        assert.isString(filePath);

        super(regent);

        if (!path.isAbsolute(filePath)) {
            filePath = path.resolve(filePath);
        }
        $protected.set(this, { filePath });
    }

    /**
     * Check whether a file exists within the file system
     *
     * @param {String} fileName
     *
     * @return {Promise<Boolean>}
     */
    async fileExists(fileName) {
        fileName = this.call(getNormalizedPath, fileName);
        if (!this.call(checkExists, fileName)) {
            return false;
        }
        try {
            const stat = await this.call(getStat, fileName);
            return stat.isFile();
        } catch (error) {
            return false;
        }
    }

    /**
     * Check whether a directory exists within the file system
     *
     * @param {String} dirName
     *
     * @return {Promise<Boolean>}
     */
    async dirExists(dirName = '') {
        dirName = this.call(getNormalizedPath, dirName);
        if (!this.call(checkExists, dirName)) {
            return false;
        }
        try {
            const stat = await this.call(getStat, dirName);
            return stat.isDirectory();
        } catch (error) {
            return false;
        }
    }

    /**
     * Create a directory if it doesn't already exist.
     *
     * @param {String} dirName
     *
     * @return {Promise<Boolean>}
     */
    async createDir(dirName = '') {
        const { filePath } = $protected(this);
        dirName = this.call(getNormalizedPath, dirName);

        if (await this.dirExists(dirName)) {
            return true;
        }

        if (filePath === dirName) {
            throw new Error('Attempted to create undefined directory');
        }

        const parent = path.dirname(dirName);
        if (!await this.dirExists(parent)) {
            await this.createDir(parent);
        }

        await new Promise((resolve, reject) => {
            return fs.mkdir(dirName, (err) => {
                return err ? reject(err) : resolve();
            });
        });

        return true;
    }

    /**
     * Append text to an existing file within the directory
     *
     * @param {String} fileName
     * @param {String} fileContent
     *
     * @return {Boolean}
     */
    appendFile(fileName, fileContent) {
        fileName = this.call(getNormalizedPath, fileName);
        return this.call(fileOut, fileName, fileContent, 'appendFile');
    }

    /**
     * Write text to a file within the directory
     *
     * @param {String} fileName
     * @param {String} fileContent
     *
     * @return {Boolean}
     */
    writeFile(fileName, fileContent) {
        fileName = this.call(getNormalizedPath, fileName);
        return this.call(fileOut, fileName, fileContent, 'writeFile');
    }

    /**
     * Remove a file
     *
     * @param {String} fileName
     *
     * @return {Boolean}
     */
    removeFile(fileName = '') {
        fileName = this.call(getNormalizedPath, fileName);
        fs.unlinkSync(fileName);
        return true;
    }

    /**
     * Copy a file
     *
     * @param {String} fromFile
     * @param {String} intoFile
     *
     * @return {Boolean}
     */
    copyFile(fromFile, intoFile) {
        assert.isString(fromFile);
        assert.isString(intoFile);

        fromFile = this.call(getNormalizedPath, fromFile);
        intoFile = this.call(getNormalizedPath, intoFile);

        fs.copyFileSync(fromFile, intoFile);

        return true;
    }

    /**
     * Extract the file-size of a file, or 0 if it doesn't exist.
     *
     * @param {String} fileName
     *
     * @return {Promise<Number>}
     */
    async getFileSize(fileName) {
        fileName = this.call(getNormalizedPath, fileName);
        if (!this.call(checkExists, fileName)) {
            return false;
        }

        const stat = await this.call(getStat, fileName);
        return stat.size;
    }

    /**
     * Read a file into a string
     *
     * @param {String} fileName
     *
     * @return {Promise}
     */
    readFile(fileName) {
        fileName = this.call(getNormalizedPath, fileName);
        return new Promise((resolve, reject) => {
            return fs.readFile(fileName, (err, data) => {
                return (err) ? reject(err) : resolve(data);
            });
        });
    }

    /**
     * Read a file into a writable stream
     *
     * @param {String}   fileName
     * @param {Writable} writeStream
     *
     * @return {Promise}
     */
    readStream(fileName, writeStream) {
        fileName = this.call(getNormalizedPath, fileName);
        return this.call(streamIO, fileName, { writeStream });
    }

    /**
     * Write a readable stream to a file
     *
     * @param {String}   fileName
     * @param {Readable} readStream
     *
     * @return {Promise}
     */
    writeStream(fileName, readStream) {
        fileName = this.call(getNormalizedPath, fileName);
        return this.call(streamIO, fileName, { readStream });
    }
}

/**
 * Normalize the path
 *
 * @method getNormalizedPath
 *
 * @param {String} pathName
 *
 * @return {String}
 */
function getNormalizedPath(pathName) {
    const { filePath } = $protected(this);
    assert.isString(pathName);
    if (!pathName.includes(filePath)) {
        pathName = this.call(sanitize, pathName);
    }
    if (!path.isAbsolute(pathName)) {
        pathName = path.resolve(filePath, pathName);
    }
    return pathName;
}

/**
 * Check to see whether a file or directory exists.
 *
 * @method checkExists
 *
 * @param {String} pathName
 *
 * @return {Boolean}
 */
function checkExists(pathName) {
    return fs.existsSync(pathName);
}

/**
 * @method fileOut
 *
 * @param {String} fileName
 * @param {String} fileContent
 * @param {String} fnName
 *
 * @return {Boolean}
 */
function fileOut(fileName, fileContent, fnName) {
    assert.isString(fileContent);
    fileName = this.call(getNormalizedPath, fileName);
    return new Promise((resolve, reject) => {
        fs[fnName].call(fs, fileName, fileContent, (err) => {
            if (err) {
                return reject(err);
            }
            return resolve(true);
        });
    });
}

/**
 * Abstract IO handler for streams
 *
 * @private
 * @method streamIO
 *
 * @param {String} fileName
 * @param {Stream} options.readStream
 * @param {Stream} options.writeStream
 *
 * @return {Promise}
 */
function streamIO(fileName, { readStream = null, writeStream = null }) {
    const streamPath = this.call(getNormalizedPath, fileName);

    if (!readStream) {
        readStream = fs.createReadStream(streamPath);
    }
    if (!writeStream) {
        writeStream = fs.createWriteStream(streamPath);
    }

    return new Promise((resolve, reject) => {
        readStream.on('error', reject);
        readStream.on('end', resolve);
        readStream.pipe(writeStream);
    });
}

/**
 * Extract the fs.stat information from a file
 *
 * @private
 * @method getStat
 *
 * @param  {String} fileName
 *
 * @return {fs.Stats}
 */
function getStat(fileName) {
    fileName = this.call(getNormalizedPath, fileName);
    return new Promise((resolve, reject) => {
        fs.stat(fileName, (err, stat) => {
            return err ? reject(err) : resolve(stat);
        });
    });
}

/**
 * @private
 *
 * @method sanitize
 *
 * @param {String} fileName
 *
 * @return {String}
 */
function sanitize(fileName) {
    assert.isString(fileName);
    return fileName.replace(/^(\/|\\)/, '');
}

module.exports = FileSystem;
