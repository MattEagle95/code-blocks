const LoggerFactory = require('../util/logger-factory')
const CryptoJS = require('crypto-js')

const auditlogMiddleware = async (req, res) => {
  const auditLogger = LoggerFactory.AuditLogger('auditlogMiddleware')
  const requestIp = CryptoJS.SHA256(req.headers['x-forwarded-for'] || req.connection.remoteAddress).toString().slice(0, 20)
  const userId = res.locals.userId || 'unauthenticated'

  auditLogger.info(`User[${userId === '-' ? 'unauthenticated' : 'id: ' + userId}, ip: ${requestIp}] ${req.method}[${req.baseUrl}${req.url}] status[${res.statusCode}]`)

  res.send(res.body)
}
module.exports = auditlogMiddleware
