'user strict'

const Promise = require('bluebird')
const ConfigRepository = require('../db/repositories/config.repository')
const LoggerFactory = require('../util/logger-factory')

class ConfigService {
  constructor () {
    this.logger = LoggerFactory.Logger(this.constructor.name)
    this.configRepository = new ConfigRepository()
  }

  findById (id) {
    return new Promise((resolve, reject) => {
      this.configRepository.findById(id)
        .then(config => {
          resolve(config)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  findByConfigKey (configKey) {
    return new Promise((resolve, reject) => {
      this.configRepository.findByConfigKey(configKey)
        .then(config => {
          resolve(config)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  getAll () {
    return new Promise((resolve, reject) => {
      this.configRepository.getAll()
        .then(configs => {
          resolve(configs)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  create (configKey, configValue) {
    return new Promise((resolve, reject) => {
      this.configRepository.create(configKey, configValue)
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
      this.configRepository.createTable()
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

module.exports = ConfigService
