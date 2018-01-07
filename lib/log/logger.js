/**
 * @author Steven Jimenez <steven@stevethedev.com>
 */
'use strict';

const dateformat   = require('dateformat');
const FileSystem   = require('regent/lib/file/file-system');
const RegentObject = require('regent/lib/util/regent-object');
const { $private } = require('regent/lib/util/scope')();

/*
 |------------------------------------------------------------------------------
 | Console Colors
 |------------------------------------------------------------------------------
 |
 | These are console colors and are responsible for handling which colors are
 | applied when various log-levels are used.
 |
 */
const COLOR_RESET = '\x1b[0m';
const COLOR_LOG   = '\x1b[35m';
const COLOR_WARN  = '\x1b[33m';
const COLOR_ERROR = '\x1b[31m';
const COLOR_INFO  = '\x1b[36m';

const PREFIX_LOG   = 'L   ';
const PREFIX_INFO  = ' I  ';
const PREFIX_WARN  = '  W ';
const PREFIX_ERROR = '   E';

// Newline Character
const NEWLINE = '\n';

/*
 |------------------------------------------------------------------------------
 | Log Levels
 |------------------------------------------------------------------------------
 |
 | Log-Levels are used to determine which logs should be displayed when content
 | is sent to the logger function. If a log-level is above the threshold that
 | is defined in the logger's configuration, then the log is displayed. If
 | the log-level is below the threshold, then the log is not displayed.
 |
 */
const LOG_LEVEL_ERROR  = 1;
const LOG_LEVEL_WARN   = 2;
const LOG_LEVEL_INFO   = 3;
const LOG_LEVEL_NORMAL = 4;

/**
 * This class is responsible for writing content to the console and to the
 * log-files.
 */

class Logger extends RegentObject {
    constructor(regent, config, logDirectory) {
        super(regent);

        const fileSystem   = new FileSystem(regent, logDirectory);
        $private.set(this, {
            config,
            fileSystem,
            logDirectory,
        });
    }

    /**
     * Standard logging.
     *
     * @param {...String} text
     *
     * @return {this}
     */
    log(...text) {
        if ($private(this).config.logLevel >= LOG_LEVEL_NORMAL) {
            this.call(writer, PREFIX_LOG, text, COLOR_LOG);
        }
        return this;
    }

    /**
     * Informational logging.
     *
     * @param {...String} text
     *
     * @return {this}
     */
    info(...text) {
        if ($private(this).config.logLevel >= LOG_LEVEL_INFO) {
            this.call(writer, PREFIX_INFO, text, COLOR_INFO);
        }
        return this;
    }

    /**
     * Warnings
     *
     * @param {...String} text
     *
     * @return {this}
     */
    warn(...text) {
        if ($private(this).config.logLevel >= LOG_LEVEL_WARN) {
            this.call(writer, PREFIX_WARN, text, COLOR_WARN);
        }
        return this;
    }

    /**
     * Errors
     *
     * @param {...String} text
     *
     * @return {this}
     */
    error(...text) {
        if ($private(this).config.logLevel >= LOG_LEVEL_ERROR) {
            this.call(writer, PREFIX_ERROR, text, COLOR_ERROR);
        }
        return this;
    }
}

/**
 * This is an internal function used to standardize the output of all of the
 * other logger functions.
 *
 * @private
 *
 * @param  {String}  prefix The prefix to add to the message.
 * @param  {Mixed[]} text   The content to write to the console and file.
 * @param  {String}  color  The color to use when writing content.
 *
 * @return {this}
 */
async function writer(prefix, text, color = '') {
    const date           = dateformat('yyyy-mm-dd');
    const fileName       = `regent-${date}.log`;
    const timestamp      = `[${dateformat('isoDateTime')}]`;
    const message        = `${text.join(' ')}`;
    const { fileSystem } = $private(this);

    process.stdout.write(
        `${timestamp} (${color}${prefix}${COLOR_RESET}) ${message}${NEWLINE}`
    );

    if (!await fileSystem.dirExists('/')) {
        await fileSystem.createDir('/');
    }

    await fileSystem.appendFile(
        fileName,
        `${timestamp} (${prefix}) ${message}${NEWLINE}`
    );

    return this;
}

module.exports = Logger;
