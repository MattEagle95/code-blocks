'use strict'

const sqlite3 = require('sqlite3').verbose()
const Promise = require('bluebird')
const LoggerFactory = require('../services/logger')
const logger = new LoggerFactory().logger
const consts = require('../config/consts.js.js')
const Env = require('../services/env')
const { resolve, reject } = require('bluebird')

class AppDAO {
  init () {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(Env.getAbsolutePath(consts.FILE_PATH_DB), (err) => {
        if (err) {
          logger.error('could not connect to database', err)
          reject(err)
        } else {
          logger.info('connected to database')
          resolve()
        }
      })
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
    this.db.all(sql, params, (err, rows) => {
      if (err) {
        console.log('Error running sql: ' + sql)
        console.log(err)
        reject(err)
      } else {
        resolve(rows)
      }
    })
  }
}

module.exports = new AppDAO()
