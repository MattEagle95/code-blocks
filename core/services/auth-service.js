'use strict'

const ConfigRepo = require('./db/config-repository')
const UserRepository = require('./db/user-repository')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const consts = require('../config/consts.js')
const LoggerFactory = require('./logger')
const logger = new LoggerFactory().logger

class AuthService {
  constructor () {
    this.userRepository = new UserRepository()
    this.configRepo = new ConfigRepo()
  }

  generateAuthToken (_user) {
    const user = _user
    return new Promise((resolve, reject) => {
      this.configRepo.getByConfigKey(consts.CONFIG_KEYS.JWT_TOKEN)
        .then(config => {
          logger.info(config)
          resolve(jwt.sign({ id: user.id }, config.config_value))
        })
    })
  }

  login (name, _password) {
    const password = _password
    return new Promise((resolve, reject) => {
      this.userRepository.getByName(name)
        .then(user => {
          if (!user) {
            logger.error('user not found')
            reject(new Error('user not found'))
          }

          if (!bcrypt.compareSync(password, user.password)) {
            logger.error('password incorrect')
            reject(new Error('password incorrect'))
          }

          logger.info('login successful')
          resolve(user)
        })
        .then(user => {
          this.generateAuthToken(user)
            .then(() => {
              resolve()
            })
        })
    })
  }
}

module.exports = AuthService
