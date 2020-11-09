'user strict'

const Promise = require('bluebird')
const TokenRepository = require('../db/repositories/token.repository')
const LoggerFactory = require('../util/logger-factory')

class TokenService {
  constructor () {
    this.logger = LoggerFactory.Logger(this.constructor.name)
    this.tokenRepository = new TokenRepository()
  }

  findById (id) {
    return new Promise((resolve, reject) => {
      this.tokenRepository.findById(id)
        .then(token => {
          resolve(token)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  findByTokenKey (tokenKey) {
    return new Promise((resolve, reject) => {
      this.tokenRepository.findByName(tokenKey)
        .then(token => {
          resolve(token)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  getAll () {
    return new Promise((resolve, reject) => {
      this.tokenRepository.getAll()
        .then(tokens => {
          resolve(tokens)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  create (tokenKey, tokenValue) {
    return new Promise((resolve, reject) => {
      this.tokenRepository.create(tokenKey, tokenValue)
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
      this.tokenRepository.createTable()
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

module.exports = TokenService
