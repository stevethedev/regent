/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const FileSystem   = require('fs');
const HttpResponse = require('regent-js/lib/http/response');
const FileMime     = require('regent-js/lib/file/mime');
const { $protected } = require('regent-js/lib/util/scope').create();

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
        const { mimeType, response, fileName } = $protected(this);
        return new Promise((resolve, reject) => {
            const stat = FileSystem.statSync(fileName);
            const readStream = FileSystem.createReadStream(fileName);

            response.writeHead(statusCode, {
                'Content-Length': stat.size,
                'Content-Type'  : mimeType,
            });

            $protected.set(this, { isSent: true });

            readStream.on('error', reject);
            readStream.on('end', resolve);
            readStream.pipe(response);
        });
    }
}

module.exports = FileResponse;
