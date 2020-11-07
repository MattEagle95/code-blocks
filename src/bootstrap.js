'use strict'

const fs = require('fs')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const Promise = require('bluebird')

const consts = require('./config/consts.js')
const Env = require('./util/env')
const LoggerFactory = require('./util/logger-factory')

const DB = require('./db/db')
const ConfigRepository = require('./db/config.repository')
const UserRepository = require('./db/user.repository')
const TokenRepository = require('./db/token.repository')

class BootstrapService {
  constructor () {
    this.logger = LoggerFactory.Logger(this.constructor.name)
    this.configRepo = new ConfigRepository()
    this.userRepo = new UserRepository()
    this.tokenRepo = new TokenRepository()
  }

  start () {
    return new Promise((resolve, reject) => {
      this.logger.info('startup')

      this.checkEnvironment()

      if (Env.checkNodeEnvDevelopment()) {
        this.deleteDB()
      } else {
        if (this.checkDBFileExists()) {
          this.logger.info(`no ${consts.DB_NAME} file found. creating a new one.`)
        } else {
          this.logger.info(`${consts.DB_NAME} file found`)
          return resolve()
        }
      }

      DB.init()
        .then(() => { return this.createDB() })
        .then(() => { return this.addConfigDBData() })
        .then(() => {
          if (Env.checkNodeEnvDevelopment()) {
            this.addDevelopmentDBData()
              .then(() => resolve())
          } else {
            resolve()
          }
        })
    })
  }

  checkDBFileExists () {
    return fs.existsSync(Env.getAbsolutePath(consts.FILE_PATH_DB))
  }

  createDB () {
    return new Promise((resolve, reject) => {
      this.configRepo.createTable()
        .then(() => {
          return this.userRepo.createTable()
        })
        .then(() => {
          return this.tokenRepo.createTable()
        })
        .then(() => {
          this.logger.info(`${consts.DB_NAME} created`)
          resolve()
        })
        .catch(error => {
          this.logger.error('startup error: ' + error)
          reject(error)
        })
    })
  }

  deleteDB () {
    if (this.checkDBFileExists()) {
      fs.unlinkSync(Env.getAbsolutePath(consts.FILE_PATH_DB))
      this.logger.info(`${consts.DB_NAME} deleted`)
    }
  }

  addConfigDBData () {
    return new Promise((resolve, reject) => {
      this.configRepo.create(consts.CONFIG_KEYS.JWT_TOKEN, crypto.randomBytes(32).toString('hex'))
        .then(() => {
          this.logger.info('config data inserted into db')
          resolve()
        })
        .catch(error => {
          this.logger.error('startup error: ' + error)
          reject(error)
        })
    })
  }

  addDevelopmentDBData () {
    return new Promise((resolve, reject) => {
      this.userRepo.create('admin', bcrypt.hashSync('root', bcrypt.genSaltSync(10)))
        .then(() => {
          this.logger.info('development data inserted into db')
          resolve()
        })
        .catch(error => {
          this.logger.error('startup error: ' + error)
          reject(error)
        })
    })
  }

  checkEnvironment () {
    if (!Env.getNodeEnv()) {
      this.logger.info(`no NODE_ENV environment var found. setting it to ${consts.NODE_ENV_DEVELOPMENT}`)
      Env.setNodeEnv(consts.NODE_ENV_DEVELOPMENT)
    }
    this.logger.info('environment: ' + Env.getNodeEnv())
  }
}

module.exports = BootstrapService
