/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const FileSystem   = require('fs');
const HttpResponse = require('regent/lib/http/response');
const FileMime     = require('regent/lib/file/mime');
const { $protected } = require('regent/lib/util/scope')();

class FileResponse extends HttpResponse {
    constructor(httpKernel, httpResponse, fileName) {
        super(httpKernel, httpResponse);

        const fileMime = new FileMime();

        $protected(this).fileName = fileName;
        $protected(this).mimeType = fileMime.getType(fileName);
    }

    /**
     * Manually define a MIME type on the returned file
     *
     * @param {String} mimeType
     *
     * @return {this}
     */
    setMime(mimeType) {
        $protected(this).mimeType = mimeType;
        return this;
    }

    /**
     * Dispatch the response to the client
     *
     * @param {Number} statusCode
     *
     * @return {Promise}
     */
    send(statusCode = $protected(this).httpStatusCode) {
        const self = $protected(this);
        return new Promise((resolve, reject) => {
            const { fileName } = self;
            const stat = FileSystem.statSync(fileName);
            const readStream = FileSystem.createReadStream(fileName);

            self.response.writeHead(statusCode, {
                'Content-Length': stat.size,
                'Content-Type'  : self.mimeType,
            });

            self.isSent = true;

            readStream.on('error', reject);
            readStream.on('end', resolve);
            readStream.pipe(self.response);
        });
    }
}

module.exports = FileResponse;
