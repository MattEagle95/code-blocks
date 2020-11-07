'use strict'

const ConfigRepo = require('../db/config-repository')
const UserRepository = require('../db/user-repository')
const TokenRepository = require('../db/token-repository')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const consts = require('../config/consts.js')
const logger = require('../util/logger-factory').Logger()

const { body } = require('express-validator')

class AuthController {
  constructor () {
    this.userRepository = new UserRepository()
    this.configRepo = new ConfigRepo()
    this.tokenRepository = new TokenRepository()
  }

  auth (val = false) {
    if (val) {
      return [
        body('name').isString(),
        body('password').isString()
      ]
    }

    return function (req, res) {
      const { name, password } = req.body

      this.login(name, password)
        .then(token => {
          res.status(201).send(token)
        })
        .catch(error => {
          res.status(400).send(error)
        })
    }
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
          return user
        })
        .then(user => {
          this.generateAuthToken(user)
            .then(data => {
              const token = data.token
              this.tokenRepository.create(data.user.id, token)
                .then(() => {
                  resolve(token)
                })
            })
        })
    })
  }

  generateAuthToken (_user) {
    const user = _user
    return new Promise((resolve, reject) => {
      this.configRepo.getByConfigKey(consts.CONFIG_KEYS.JWT_TOKEN)
        .then(config => {
          resolve({ user: user, token: jwt.sign({ id: user.id }, config.config_value) })
        })
    })
  }
}

module.exports = new AuthController()
