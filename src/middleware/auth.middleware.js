const { reject } = require('bluebird')
const jwt = require('jsonwebtoken')
const consts = require('../config/consts')
const ConfigRepository = require('../db/repositories/config.repository')
const TokenRepository = require('../db/repositories/token.repository')

const authMiddleware = async (req, res, next) => {
  const tokenRepo = new TokenRepository()
  const configRepo = new ConfigRepository()

  configRepo.findByConfigKey(consts.CONFIG_KEYS.JWT_TOKEN)
    .then(config => {
      try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, config.config_value)

        tokenRepo.findByUserIdAndToken(data.id, token)
          .then(token => {
            console.log('found')
            req.token = token
            next()
          })
          .catch(error => {
            res.status(401).status({ error: error })
          })
      } catch (err) {
        console.log('err: ' + err)
        reject(err)
      }
    })
}
module.exports = authMiddleware
