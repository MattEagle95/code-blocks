'use strict'

const sqlite3 = require('sqlite3').verbose()
const Promise = require('bluebird')
const LoggerFactory = require('../util/logger-factory')
const consts = require('../config/consts.js')
const Env = require('../util/env')
const { resolve, reject } = require('bluebird')

class DB {
  constructor () {
    this.logger = LoggerFactory.Logger(this.constructor.name)
  }

  init () {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(Env.getAbsolutePath(consts.FILE_PATH_DB), (err) => {
        if (err) {
          this.logger.error('could not connect to database', err)
          reject(err)
        } else {
          this.logger.info('connected to database')
          resolve()
        }
      })
    })
  }

  disconnect () {
    this.db.close((err) => {
      if (err) {
        return console.error(err.message)
      }
      this.logger.info('closed the database connection')
    })
  }

  run (sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          console.log('Error running sql ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve({ id: this.lastID })
        }
      })
    })
  }

  get (sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result) => {
        if (err) {
          console.log('Error running sql: ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }

  all (sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.log('Error running sql: ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }
}

module.exports = new DB()
