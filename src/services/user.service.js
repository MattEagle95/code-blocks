'user strict'

const Promise = require('bluebird')
const bcrypt = require('bcryptjs')
const LoggerFactory = require('../util/logger-factory')
const UserRepository = require('../db/repositories/user.repository')

class UserService {
  constructor () {
    this.logger = LoggerFactory.Logger(this.constructor.name)
    this.userRepository = new UserRepository()
  }

  findById (id) {
    return new Promise((resolve, reject) => {
      this.userRepository.findById(id)
        .then(user => {
          resolve(user)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  findByName (name) {
    return this.userRepository.findByName(name)
  }

  getAll () {
    return new Promise((resolve, reject) => {
      this.userRepository.getAll()
        .then(users => {
          resolve(users)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  create (name, password) {
    return new Promise((resolve, reject) => {
      const passwordEncrypted = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

      this.userRepository.create(name, passwordEncrypted)
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  createTable () {
    return new Promise((resolve, reject) => {
      this.userRepository.createTable()
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
