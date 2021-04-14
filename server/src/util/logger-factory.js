const winston = require('winston')
require('winston-daily-rotate-file')
const consts = require('../config/consts.js')

const formats = {
  default: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.metadata({ fillExcept: ['message', 'level', 'moduleName', 'logType', 'timestamp'] }),
    winston.format.printf(info => `[${info.timestamp}] ${info.level} ${info.logType} [${info.moduleName}]: ${info.message} ${JSON.stringify(info.metadata)}`)
  ),
  auditlog: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.metadata({ fillExcept: ['message', 'level', 'moduleName', 'logType', 'timestamp'] }),
    winston.format.printf(info => `[${info.timestamp}] ${info.level} ${info.logType}: ${info.message} ${JSON.stringify(info.metadata)}`)
  )
}

const transports = {
  console: new winston.transports.Console({
    level: 'debug',
    format: winston.format.combine(
      winston.format.colorize(),
      formats.default
    ),
    handleExceptions: true
  }),
  error: new winston.transports.DailyRotateFile({
    level: 'error',
    format: winston.format.combine(
      formats.default
    ),
    dirname: consts.FILE_PATH_LOGS + 'error/',
    filename: 'error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',
    handleExceptions: true
  }),
  info: new winston.transports.DailyRotateFile({
    level: 'info',
    format: winston.format.combine(
      formats.default
    ),
    dirname: consts.FILE_PATH_LOGS + 'combined/',
    filename: 'combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',
    handleExceptions: true
  }),
  audit: new winston.transports.DailyRotateFile({
    level: 'info',
    format: winston.format.combine(
      formats.auditlog
    ),
    dirname: consts.FILE_PATH_LOGS + 'audit/',
    filename: 'audit-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',
    handleExceptions: true
  })
}

const logger = winston.createLogger({
  transports: [
    transports.console,
    transports.error,
    transports.info
  ],
  exitOnError: false
})

const auditLogger = winston.createLogger({
  transports: [
    transports.console,
    transports.error,
    transports.info,
    transports.audit
  ],
  exitOnError: false
})

class LoggerFactory {
  static Logger (moduleName = 'undefined') {
    return logger.child({ moduleName: moduleName, logType: 'default' })
  }

  static AuditLogger (moduleName = 'undefined') {
    return auditLogger.child({ moduleName: moduleName, logType: 'audit' })
  }
}

module.exports = LoggerFactory
