const { reject } = require('bluebird')
const jwt = require('jsonwebtoken')
const consts = require('../config/consts')
const ConfigRepository = require('../db/repositories/config.repository')
const TokenRepository = require('../db/repositories/token.repository')
const LoggerFactory = require('../util/logger-factory')

const authMiddleware = async (req, res, next) => {
  const logger = LoggerFactory.AuditLogger('authMiddleware')
  const tokenRepo = new TokenRepository()
  const configRepo = new ConfigRepository()

  configRepo.findByConfigKey(consts.CONFIG_KEYS.JWT_TOKEN)
    .then(config => {
      try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, config.config_value)

        tokenRepo.findByUserIdAndToken(data.id, token)
          .then(token => {
            req.token = token
            res.locals.userId = data.id;  
            next()
          })
          .catch(error => {
            res.status(401).send({ error: error })
          })
      } catch (err) {
        logger.debug('request failed, unauthenticated')
        res.status(401).send({ error: err })
      }
    })
}
module.exports = authMiddleware
