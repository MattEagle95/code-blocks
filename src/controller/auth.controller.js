'use strict'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const consts = require('../config/consts.js')

const ConfigRepository = require('../db/repositories/config.repository')
const TokenRepository = require('../db/repositories/token.repository')
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
        .then(user => {
          return this.configRepository.findByConfigKey(consts.CONFIG_KEYS.JWT_TOKEN)
            .then(config => {
              return new Promise((resolve, reject) => {
                resolve({ user, config })
              })
            })
        })
        .then(data => {
          resolve(jwt.sign({ id: data.user.id }, data.config.config_value))
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

module.exports = AuthController
