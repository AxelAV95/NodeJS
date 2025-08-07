// utils/logger.js
const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logsDir = path.join(__dirname, '../logs');
        this.ensureLogsDir();
    }

    ensureLogsDir() {
        if (!fs.existsSync(this.logsDir)) {
            fs.mkdirSync(this.logsDir, { recursive: true });
        }
    }

    log(message, level = 'INFO') {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level}] ${message}\n`;
        
        // Escribir a consola
        console.log(logMessage.trim());
        
        // Escribir a archivo
        const logFile = path.join(this.logsDir, `${this.getDateString()}.log`);
        fs.appendFileSync(logFile, logMessage);
    }

    getDateString() {
        const now = new Date();
        return now.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    info(message) {
        this.log(message, 'INFO');
    }

    error(message) {
        this.log(message, 'ERROR');
    }

    success(message) {
        this.log(message, 'SUCCESS');
    }
}

module.exports = new Logger();