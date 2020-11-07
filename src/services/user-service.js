'user strict'

const Promise = require('bluebird')
const bcrypt = require('bcryptjs')
const LoggerFactory = require('../util/logger-factory')
const UserRepository = require('../db/user-repository')

class UserService {
  constructor () {
    this.logger = LoggerFactory.Logger(this.constructor.name)
    this.userRepo = new UserRepository()
  }

  create (name, password) {
    return new Promise((resolve, reject) => {
      const passwordEncrypted = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

      this.UserRepository.create(name, passwordEncrypted)
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

module.exports = UserService
