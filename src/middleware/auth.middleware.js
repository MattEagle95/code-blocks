const jwt = require('jsonwebtoken')
const consts = require('../config/consts')
const ConfigRepository = require('../db/config.repository')
const TokenRepository = require('../db/token.repository')

const authMiddleware = async (req, res, next) => {
  const tokenRepo = new TokenRepository()
  const configRepo = new ConfigRepository()

  configRepo.getByConfigKey(consts.CONFIG_KEYS.JWT_TOKEN)
    .then(config => {
      const token = req.header('Authorization').replace('Bearer ', '')
      const data = jwt.verify(token, config.config_value)

      tokenRepo.findByUserIdAndToken(data.id)
        .then(token => {
          console.log('found')
          req.token = token
          next()
        })
        .catch(error => {
          res.status(401).status({ error: error })
        })
    })
}
module.exports = authMiddleware
