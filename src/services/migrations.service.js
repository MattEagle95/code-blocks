'user strict'

const Promise = require('bluebird')
const MigrationsRepository = require('../db/repositories/migrations.repository')
const LoggerFactory = require('../util/logger-factory')

class MigrationsService {
  constructor () {
    this.logger = LoggerFactory.Logger(this.constructor.name)
    this.migrationsRepository = new MigrationsRepository()
  }

  findLatest () {
    return new Promise((resolve, reject) => {
      this.migrationsRepository.findLatest()
        .then(migration => {
          resolve(migration)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

module.exports = MigrationsService
