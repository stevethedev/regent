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

        $protected.set(this, { filePath });
    }

    /**
     * Check whether a file exists within the file system
     *
     * @param {String} fileName
     *
     * @return {Promise<Boolean>}
     */
    async fileExists(fileName = '') {
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
    async createDir(dirName) {
        assert.isString(dirName);
        dirName = this.call(sanitize, dirName);

        if (!dirName) {
            throw new Error('Attempted to create undefined directory');
        }

        if (await this.dirExists(dirName)) {
            return true;
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
        return this.call(fileOut, fileName, fileContent, 'appendFileSync');
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
        return this.call(fileOut, fileName, fileContent, 'writeFileSync');
    }

    /**
     * Remove a file
     *
     * @param {String} fileName
     *
     * @return {Boolean}
     */
    removeFile(fileName) {
        assert.isString(fileName);
        fileName = this.call(sanitize, fileName);

        fileName = path.resolve($protected(this).filePath, fileName);

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

        const { filePath } = $protected(this);

        fromFile = this.call(sanitize, fromFile);
        intoFile = this.call(sanitize, intoFile);

        fromFile = path.resolve(filePath, fromFile);
        intoFile = path.resolve(filePath, intoFile);

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
        const { filePath } = $protected(this);

        assert.isString(fileName);
        fileName = this.call(sanitize, fileName);
        fileName = path.resolve(filePath, fileName);

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
        return this.call(streamIO, fileName, { readStream });
    }
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
    const { filePath } = $protected(this);

    assert.isString(pathName);

    pathName = this.call(sanitize, pathName);
    pathName = path.resolve(filePath, pathName);

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
    assert.isString(fileName);
    assert.isString(fileContent);

    const { filePath } = $protected(this);

    fileName = this.call(sanitize, fileName);
    fileName = path.resolve(filePath, fileName);

    fs[fnName].call(fs, fileName, fileContent);

    return true;
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
    assert.isString(fileName);
    fileName = this.call(sanitize, fileName);

    const { filePath } = $protected(this);
    const streamPath = path.resolve(filePath, fileName);

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
    return new Promise((resolve, reject) => {
        const { filePath } = $protected(this);

        fileName = this.call(sanitize, fileName);
        fileName = path.resolve(filePath, fileName);

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
    return fileName.replace(/^\/+/, '');
}

module.exports = FileSystem;
