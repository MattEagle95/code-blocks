"use strict";

const sqlite3 = require('sqlite3').verbose()
const Promise = require('bluebird')

class AppDAO {
  constructor() {
    var fs = require('fs');
    if(fs.existsSync('./db/db.sqlite3')) {
      console.log('deleted db.sqlite3')
    fs.unlinkSync('./db/db.sqlite3');
    }
    this.db = new sqlite3.Database('./db/db.sqlite3', (err) => {
      if (err) {
        console.log('Could not connect to database', err)
      } else {
        console.log('Connected to database')
      }
    })
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          console.log('Error running sql ' + sql)
          console.log(err)
          reject(err)
        } else {
          console.log('success ' + { id: this.lastID })
          resolve({ id: this.lastID })
        }
      })
    })
  }
  
  get(sql, params = []) {
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

  all(sql, params = []) {
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