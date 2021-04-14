const { body } = require('express-validator')
const validateMiddleware = require('../middleware/validate.middleware')
const LoggerFactory = require('../util/logger-factory')
const rateLimit = require('express-rate-limit')
const router = require('express').Router()
const auditLogger = LoggerFactory.AuditLogger('authRoutes')
const CryptoJS = require('crypto-js')
const db = require('../database/models/')
const { reject } = require('bluebird')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../storage/config/config.json')

const loginAttemptLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  onLimitReached: (req, res, options) => {
    const requestIp = CryptoJS.SHA256(req.headers['x-forwarded-for'] || req.connection.remoteAddress).toString().slice(0, 20)
    const userId = res.locals.userId || '-'

    auditLogger.info(`User[${userId === '-' ? 'unauthenticated' : 'id: ' + userId}, ip: ${requestIp}] ${req.method}[${req.baseUrl}${req.url}] status[${options.statusCode}] - Too many failed login attempts`)
  }
})

router.post('/login', [
  body('email').notEmpty(),
  body('password').notEmpty()
], loginAttemptLimiter, validateMiddleware, (req, res) => {
  const { email, password } = req.body
  const requestIp = CryptoJS.SHA256(req.headers['x-forwarded-for'] || req.connection.remoteAddress).toString().slice(0, 20)

  db.models.User.findOne({ where: { email: email } })
    .then(user => {
      if (!user) {
        reject(new Error('user not found'))
      }

      if (!bcrypt.compareSync(password, user.password)) {
        reject(new Error('password incorrect'))
      }

      return user
    })
    .then(user => {
      auditLogger.info(`User[${user.id}, ip: ${requestIp}] ${req.method}[${req.baseUrl}${req.url}] status[201] - Successfully logged in`)
      res.status(201).send({ token: jwt.sign({ id: user.id }, config.JWT_TOKEN) })
    })
    .catch(error => {
      auditLogger.info(`User['unauthenticated', ip: ${requestIp}] ${req.method}[${req.baseUrl}${req.url}] status[400] - Failed login attempt`)
      res.status(400).send(error)
    })
})

// TODO logout
module.exports = router
