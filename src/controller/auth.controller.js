'use strict'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const consts = require('../config/consts.js')

const ConfigRepository = require('../db/config.repository')
const TokenRepository = require('../db/token.repository')
const UserService = require('../services/user.service')

class AuthController {
  constructor () {
    this.userService = new UserService()
    this.configRepository = new ConfigRepository()
    this.tokenRepository = new TokenRepository()
  }

  auth (name, _password) {
    const password = _password
    return new Promise((resolve, reject) => {
      this.userService.findByName(name)
        .then(user => {
          if (!user) {
            reject(new Error('user not found'))
          }

          if (!bcrypt.compareSync(password, user.password)) {
            reject(new Error('password incorrect'))
          }

          return user
        })
        .then(_user => {
          const user = _user
          this.configRepository.getByConfigKey(consts.CONFIG_KEYS.JWT_TOKEN)
            .then(config => {
              resolve({ user: user, token: jwt.sign({ id: user.id }, config.config_value) })
            })
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

module.exports = AuthController
