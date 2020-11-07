const winston = require('winston')
require('winston-daily-rotate-file')
const consts = require('../config/consts.js')

const logFormat = winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)

class LoggerFactory {
  static getLogger () {
    return winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] })
      ),
      transports: [
        new winston.transports.Console({
          level: 'debug',
          format: winston.format.combine(
            winston.format.colorize(),
            logFormat
          ),
          handleExceptions: true
        }),
        new winston.transports.DailyRotateFile({
          level: 'debug',
          format: winston.format.combine(
            logFormat
          ),
          dirname: consts.FILE_PATH_LOGS,
          filename: 'debug-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          handleExceptions: true
        }),
        new winston.transports.DailyRotateFile({
          level: 'error',
          format: winston.format.combine(
            winston.format.json()
          ),
          dirname: consts.FILE_PATH_LOGS + 'error/',
          filename: 'error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '30d',
          handleExceptions: true
        }),
        new winston.transports.DailyRotateFile({
          level: 'info',
          format: winston.format.combine(
            winston.format.json()
          ),
          dirname: consts.FILE_PATH_LOGS + 'combined/',
          filename: 'combined-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: '30d',
          handleExceptions: true
        })
      ],
      exitOnError: false
    })
  }
}

module.exports = LoggerFactory
