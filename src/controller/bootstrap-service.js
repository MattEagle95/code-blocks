'use strict'

const fs = require('fs')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const Promise = require('bluebird')

const consts = require('../config/consts.js')
const Env = require('../util/env')
const logger = require('..//util/logger-factory').getLogger()

const AppDAO = require('../db/dao')
const ConfigRepo = require('../db/config-repository')
const UserRepo = require('../db/user-repository')
const TokenRepo = require('../db/token-repository')

class BootstrapService {
  constructor () {
    this.configRepo = new ConfigRepo()
    this.userRepo = new UserRepo()
    this.tokenRepo = new TokenRepo()
  }

  start () {
    return new Promise((resolve, reject) => {
      logger.info('startup')

      this.checkEnvironment()

      if (Env.checkNodeEnvDevelopment()) {
        this.deleteDB()
      } else {
        if (this.checkDBFileExists()) {
          logger.info(`no ${consts.DB_NAME} file found. creating a new one.`)
        } else {
          logger.info(`${consts.DB_NAME} file found`)
          return resolve()
        }
      }

      AppDAO.init()
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
          logger.info(`${consts.DB_NAME} created`)
          resolve()
        })
        .catch(error => {
          logger.error('startup error: ' + error)
          reject(error)
        })
    })
  }

  deleteDB () {
    if (this.checkDBFileExists()) {
      fs.unlinkSync(Env.getAbsolutePath(consts.FILE_PATH_DB))
      logger.info(`${consts.DB_NAME} deleted`)
    }
  }

  addConfigDBData () {
    return new Promise((resolve, reject) => {
      this.configRepo.create(consts.CONFIG_KEYS.JWT_TOKEN, crypto.randomBytes(32).toString('hex'))
        .then(() => {
          logger.info('config data inserted into db')
          resolve()
        })
        .catch(error => {
          logger.error('startup error: ' + error)
          reject(error)
        })
    })
  }

  addDevelopmentDBData () {
    return new Promise((resolve, reject) => {
      this.userRepo.create('admin', bcrypt.hashSync('root', bcrypt.genSaltSync(10)))
        .then(() => {
          logger.info('development data inserted into db')
          resolve()
        })
        .catch(error => {
          logger.error('startup error: ' + error)
          reject(error)
        })
    })
  }

  checkEnvironment () {
    if (!Env.getNodeEnv()) {
      logger.info(`no NODE_ENV environment var found. setting it to ${consts.NODE_ENV_DEVELOPMENT}`)
      Env.setNodeEnv(consts.NODE_ENV_DEVELOPMENT)
    }
    logger.info('environment: ' + Env.getNodeEnv())
  }
}

module.exports = BootstrapService
