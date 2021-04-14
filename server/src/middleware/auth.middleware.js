const jwt = require('jsonwebtoken')
const config = require('../../storage/config/config.json')
const db = require('../database/models')
const LoggerFactory = require('../util/logger-factory')

const authMiddleware = async (req, res, next) => {
  const logger = LoggerFactory.AuditLogger('authMiddleware')

  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, config.JWT_TOKEN)

    db.models.Token.findOne({ where: { userId: data.id, token: token } })
      .then(token => {
        req.token = token.token
        res.locals.userId = data.id
        next()
      })
      .catch(error => {
        res.status(401).send({ error: error })
      })
  } catch (err) {
    logger.debug('request failed, unauthenticated')
    res.status(401).send({ error: err })
  }
}
module.exports = authMiddleware
