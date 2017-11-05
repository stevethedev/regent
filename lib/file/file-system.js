/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const assert       = requireLib('util/assert');
const fs           = require('fs');
const path         = require('path');
const RegentObject = requireLib('util/regent-object');
const { _protected } = requireLib('util/scope')();

class FileSystem extends RegentObject
{
    /**
     * Represent an internal file-system for Regent
     * 
     * @param {Regent} regent
     * @param {String} filePath
     */
    constructor(regent, filePath)
    {
        assert.isString(filePath);

        super(regent);

        const self = _protected(this);

        self.filePath = filePath;
    }

    /**
     * Check whether a file exists within the file system
     *
     * @param {String} fileName
     *
     * @return {Promise<Boolean>}
     */
    async fileExists(fileName)
    {
        assert.isString(fileName);

        const self = _protected(this);

        fileName = path.join(self.filePath, fileName);
        
        if (!fs.existsSync(fileName)) {
            return false;
        }

        const stat = await this.call(getStat, fileName);
        return stat.isFile();
    }

    /**
     * Check whether a directory exists within the file system
     *
     * @param {String} dirName
     *
     * @return {Promise<Boolean>}
     */
    async dirExists(dirName)
    {
        assert.isString(dirName);

        const self = _protected(this);

        dirName = path.join(self.filePath, dirName);

        if (!fs.existsSync(dirName)) {
            return false;
        }

        const stat = await this.call(getStat, fileName);
        return stat.isDirectory();
    }

    async createDir(dirName)
    {
        assert.isString(dirName);

        if (await this.dirExists(dirName)) {
            return true;
        }

        const self = _protected(this);

        const parent = path.dirname(dirName);
        if (!await this.dirExists(parent)) {
            await this.createDir(parent);
        }

        await new Promise((resolve, reject) => {
            return fs.mkdir(parent, (err) => {
                return (err) ? reject(err) : resolve();
            });
        });

        return true;
    }

    async appendFile(fileName, content)
    {
        assert.isString(fileName);
        assert.isString(content);

        return fs.appendFileSync(fileName, content);
    }

    /**
     * Extract the file-size of a file, or 0 if it doesn't exist.
     *
     * @param {String} fileName
     *
     * @return {Promise<Number>}
     */
    async getFileSize(fileName)
    {
        assert.isString(fileName);

        const self = _protected(this);

        fileName = path.join(self.filePath, fileName);

        if (!fs.existsSync(fileName)) {
            return 0;
        }

        const stat = await this.call(getStat, fileName);
        return stat.size;
    }

    /**
     * Read a file into a writable stream
     *
     * @param {String}   fileName
     * @param {Writable} writeStream
     *
     * @return {Promise}
     */
    async readStream(fileName, writeStream)
    {
        assert.isString(fileName);

        const self = _protected(this);

        return new Promise((resolve, reject) => {
            const streamPath = path.join(self.filePath, fileName);
            const readStream = fs.createReadStream(streamPath);

            readStream.on('error', reject);
            readStream.on('end', resolve);
            readStream.pipe(writeStream);
        });
    }

    /**
     * Write a readable stream to a file
     *
     * @param {String}   fileName
     * @param {Readable} readStream
     *
     * @return {Promise}
     */
    async writeStream(fileName, readStream)
    {
        assert.isString(fileName);

        const self = _protected(this);

        return new Promise((resolve, reject) => {
            const streamPath = path.join(self.filePath, fileName);
            const writeStream = fs.createWriteStream(streamPath);

            readStream.on('error', reject);
            readStream.on('end', resolve);
            readStream.pipe(writeStream);
        });
    }
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
function getStat(fileName)
{
    return new Promise((resolve, reject) => {
        fs.stat(fileName, (err, stat) => {
            return (err)
                ? reject(err)
                : resolve(stat);
        });
    });
}

module.exports = FileSystem;
