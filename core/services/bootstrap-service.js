'use strict'

const fs = require('fs')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const Promise = require('bluebird')

const consts = require('../config/consts.js')
const Env = require('./env')
const LoggerFactory = require('./logger')
const logger = new LoggerFactory().logger

const AppDAO = require('./db/dao')
const UserRepo = require('./db/user-repository')
const ConfigRepo = require('./db/config-repository')

class BootstrapService {
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
    const configRepo = new ConfigRepo()
    const userRepo = new UserRepo()

    return new Promise((resolve, reject) => {
      configRepo.createTable()
        .then(() => {
          return userRepo.createTable()
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
    const configRepo = new ConfigRepo()

    return new Promise((resolve, reject) => {
      configRepo.create('jwt_key', crypto.randomBytes(32).toString('hex'))
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
    const userRepo = new UserRepo()

    return new Promise((resolve, reject) => {
      userRepo.create('admin', bcrypt.hashSync('root', bcrypt.genSaltSync(10)))
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
