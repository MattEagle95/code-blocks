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

class BootstrapService {
  start() {
    logger.info('startup')

    this.checkEnvironment()
    this.deleteDB()
    
    // if(Env.checkDevelopment()) {
    //   logger.info('environment: development - deleting sqlite3 db file if exists and creating a new one.')
    //   this.deleteDB()
    // } else {
    //   if(this.checkDBFileExists()) {
    //     logger.info('no sqlite3 db file found. creating a new one.')
    //   } else {
    //     logger.info('sqlite3 db file found.')
    //     return resolve(true)
    //   }
    // }

    return this.createDB()
  }

  checkDBFileExists() {
    return fs.existsSync('../../db/db.sqlite3')
  }

  createDB() {
    const configRepo = new ConfigRepo()
    const userRepo = new UserRepo()
    logger.info('createDB')
    
    return new Promise((resolve, reject) => {
      configRepo.createTable()
      .then(() => {
        return configRepo.create('jwt_key', crypto.randomBytes(32).toString('hex'))
      })
      .then(() => {
        return userRepo.createTable()
      })
      .then(() => {
        return userRepo.create('Colin', bcrypt.hashSync('test', bcrypt.genSaltSync(10)))
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
      fs.unlinkSync('../../db/db.sqlite3')
      logger.info('db.sqlite3 deleted')
    }
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