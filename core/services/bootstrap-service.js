'use strict'

const fs = require('fs')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const Promise = require('bluebird')

const Env = require('./env')
const loggerFactory = require('./logger')
const logger = new loggerFactory().logger

const UserRepo = require('./db/user-repository')
const ConfigRepo = require('./db/config-repository')
const { resolve } = require('bluebird')

const dbFilePath = '../../db/db.sqlite3'

class BootstrapService {
  start() {
    return new Promise((resolve, reject) => {
      logger.info('startup')

      this.checkEnvironment()

      if(Env.checkDevelopment()) {
        this.deleteDB()
      } else {
        if(this.checkDBFileExists()) {
          logger.info('no sqlite3 db file found. creating a new one.')
        } else {
          logger.info('sqlite3 db file found.')
          return resolve()
        }
      }

      this.createDB().then(() => {
          this.addConfigDBData()
          .then(() => {
            if(Env.checkDevelopment()) {
            this.addDevelopmentDBData()
            .then(() => resolve())
            } else {
              resolve()
            }
          })
      })
    })
  }

  checkDBFileExists() {
    return fs.existsSync(dbFilePath)
  }

  createDB() {
    const configRepo = new ConfigRepo()
    const userRepo = new UserRepo()
    
    return new Promise((resolve, reject) => {
      configRepo.createTable()
      .then(() => {
        return userRepo.createTable()
      })
      .then(() => {
        logger.info('db.sqlite3 created')
        resolve()
      })
      .catch(error => {
        logger.error('startup error: ' + error)
        reject(error)
      })
    })
  }

  deleteDB() {
    if(this.checkDBFileExists()) {
      fs.unlinkSync(dbFilePath)
      logger.info('db.sqlite3 deleted')
    }
  }

  addConfigDBData() {
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

  addDevelopmentDBData() {
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

  checkEnvironment() {
    if(!Env.getEnv())  {
      logger.info('no NODE_ENV environment var found. setting it to development')
      Env.setEnv("development")
    }
    logger.info('environment: ' + Env.getEnv())
  }
}

module.exports = BootstrapService