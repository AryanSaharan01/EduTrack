const fs = require('fs');
const path = require('path');

// Log levels
const LOG_LEVELS = {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    DEBUG: 'DEBUG'
};

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

/**
 * Format log message
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} [meta] - Additional metadata
 * @returns {string} Formatted log message
 */
function formatLog(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaString = Object.keys(meta).length ? ` - ${JSON.stringify(meta)}` : '';
    return `[${level}] ${timestamp} - ${message}${metaString}\n`;
}

/**
 * Write log to file
 * @param {string} content - Log content
 */
function writeToFile(content) {
    const date = new Date().toISOString().split('T')[0];
    const logFile = path.join(logsDir, `${date}.log`);
    fs.appendFileSync(logFile, content);
}

/**
 * Log debug message
 * @param {string} message - Debug message
 * @param {Object} [meta] - Additional metadata
 */
function logDebug(message, meta) {
    if (process.env.NODE_ENV !== 'production') {
        const log = formatLog(LOG_LEVELS.DEBUG, message, meta);
        console.debug(log);
        writeToFile(log);
    }
}

/**
 * Log info message
 * @param {string} message - Info message
 * @param {Object} [meta] - Additional metadata
 */
function logInfo(message, meta) {
    const log = formatLog(LOG_LEVELS.INFO, message, meta);
    console.log(log);
    writeToFile(log);
}

/**
 * Log warning message
 * @param {string} message - Warning message
 * @param {Object} [meta] - Additional metadata
 */
function logWarn(message, meta) {
    const log = formatLog(LOG_LEVELS.WARN, message, meta);
    console.warn(log);
    writeToFile(log);
}

/**
 * Log error message
 * @param {string} message - Error message
 * @param {Error} [error] - Error object
 * @param {Object} [meta] - Additional metadata
 */
function logError(message, error, meta = {}) {
    if (error) {
        meta.errorMessage = error.message;
        meta.stack = error.stack;
    }
    const log = formatLog(LOG_LEVELS.ERROR, message, meta);
    console.error(log);
    writeToFile(log);
}

module.exports = {
    logDebug,
    logInfo,
    logWarn,
    logError,
    LOG_LEVELS
};