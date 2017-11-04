/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const FileSystem   = require('fs');
const HttpResponse = requireLib('http/response');
const FileMime     = requireLib('file/mime');
const { _protected } = requireLib('util/scope')();

class FileResponse extends HttpResponse
{
    constructor(httpKernel, httpResponse, fileName)
    {
        super(httpKernel, httpResponse);

        const fileMime = new FileMime();

        _protected(this).fileName = fileName;
        _protected(this).mimeType = fileMime.getType(fileName);
    }

    /**
     * Manually define a MIME type on the returned file
     *
     * @param {String} mimeType
     *
     * @chainable
     */
    setMime(mimeType)
    {
        _protected(this).mimeType = mimeType;
        return this;
    }

    /**
     * [statusCode description]
     *
     * @type {[type]}
     */
    send(statusCode = _protected(this).httpStatusCode)
    {
        const self = _protected(this);
        return new Promise((resolve, reject) => {
            const fileName = self.fileName;
            const stat = FileSystem.statSync(fileName);
            const readStream = FileSystem.createReadStream(fileName);

            self.response.writeHead(statusCode, {
                'Content-Type': self.mimeType,
                'Content-Length': stat.size,
            });

            self.isSent = true;

            readStream.on('error', reject);
            readStream.on('end', resolve);
            readStream.pipe(self.response);
        });
    }
}

module.exports = FileResponse;
