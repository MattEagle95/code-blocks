const { body } = require('express-validator')
const AuthController = require('../controller/auth.controller')
const validateMiddleware = require('../middleware/validate.middleware')
const LoggerFactory = require('../util/logger-factory')
const rateLimit = require("express-rate-limit")
const router = require('express').Router()
const auditLogger = LoggerFactory.AuditLogger('authRoutes')
var CryptoJS = require("crypto-js");
const authMiddleware = require('../middleware/auth.middleware')
const authController = new AuthController()

const loginAttemptLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  onLimitReached: (req, res, options) => {
    const requestIp = CryptoJS.SHA256(req.headers['x-forwarded-for'] || req.connection.remoteAddress).toString().slice(0, 20)
    const userId = res.locals.userId || '-'

    auditLogger.info(`User[${userId === '-' ? 'unauthenticated' : 'id: ' + userId}, ip: ${requestIp}] ${req.method}[${req.baseUrl}${req.url}] status[${options.statusCode}] - Too many failed login attempts`)
  }
});

router.post('/login', [
  body('name').notEmpty(),
  body('password').notEmpty()
], loginAttemptLimiter, validateMiddleware, (req, res) => {
  const { name, password } = req.body
  const requestIp = CryptoJS.SHA256(req.headers['x-forwarded-for'] || req.connection.remoteAddress).toString().slice(0, 20)

  authController.auth(name, password)
    .then(data => {
      auditLogger.info(`User[${data.userId}, ip: ${requestIp}] ${req.method}[${req.baseUrl}${req.url}] status[201] - Successfully logged in`)
      res.status(201).send({ token: data.token })
    })
    .catch(error => {
      auditLogger.info(`User['unauthenticated', ip: ${requestIp}] ${req.method}[${req.baseUrl}${req.url}] status[400] - Failed login attempt`)
      res.status(400).send(error)
    })
})

router.post('/logout', authMiddleware, (req, res, next) => {
  const requestIp = CryptoJS.SHA256(req.headers['x-forwarded-for'] || req.connection.remoteAddress).toString().slice(0, 20)

  authController.auth(name, password)
    .then(data => {
      auditLogger.info(`User[${data.userId}, ip: ${requestIp}] ${req.method}[${req.baseUrl}${req.url}] status[201] - Successfully logged in`)
      res.status(201).send({ token: data.token })
    })
    .catch(error => {
      auditLogger.info(`User['unauthenticated', ip: ${requestIp}] ${req.method}[${req.baseUrl}${req.url}] status[400] - Failed login attempt`)
      res.status(400).send(error)
    })
})

module.exports = router
