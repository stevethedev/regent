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
    fileExists(fileName)
    {
        assert.isString(fileName);

        const self = _protected(this);
        fileName = path.join(self.filePath, fileName);
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(fileName)) {
                return resolve(false);
            }

            fs.stat(fileName, (err, stat) => {
                if (err) {
                    return reject(err);
                }
                return resolve(stat.isFile());
            });
        });
    }

    /**
     * Check whether a directory exists within the file system
     *
     * @param {String} dirName
     *
     * @return {Promise<Boolean>}
     */
    dirExists(dirName)
    {
        assert.isString(dirName);

        const self = _protected(this);

        dirName = path.join(self.filePath, dirName);
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(dirName)) {
                return resolve(false);
            }

            fs.stat(dirName, (err, stat) => {
                if (err) {
                    return reject(err);
                }
                return resolve(stat.isDirectory());
            });
        });
    }

    getFileSize(fileName)
    {
        assert.isString(fileName);

        const self = _protected(this);

        fileName = path.join(self.filePath, fileName);
        return new Promise((resolve, reject) => {
            fs.stat(fileName, (err, stat) => {
                if (err) {
                    return reject(err);
                }
                return resolve(stat.size);
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
    readStream(fileName, writeStream)
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
    writeStream(fileName, readStream)
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

module.exports = FileSystem;
