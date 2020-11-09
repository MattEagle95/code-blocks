'use strict'

const DB = require('../db')

class MigrationsRepository {
  constructor () {
    this.db = DB
    this.tableName = '´Migrations'
  }

  findLatest () {
    return this.db.get(
      `SELECT * FROM ${this.tableName} ORDER BY id DESC`)
  }
}

module.exports = MigrationsRepository
