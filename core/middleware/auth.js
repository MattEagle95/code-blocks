const jwt = require('jsonwebtoken')
const consts = require('../config/consts')
const TokenRepo = require('../services/db/token-repository')
const ConfigRepo = require('../services/db/config-repository')

const auth = async (req, res, next) => {
  const tokenRepo = new TokenRepo()
  const configRepo = new ConfigRepo()

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
module.exports = auth
