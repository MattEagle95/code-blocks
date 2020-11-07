'use strict'

const DB = require('./db')

class ConfigRepository {
  constructor () {
    this.db = DB
    this.tableName = 'Config'
  }

  getById (id) {
    return this.db.get(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id])
  }

  getByConfigKey (configKey) {
    return this.db.get(
      `SELECT * FROM ${this.tableName} WHERE config_key = ?`,
      [configKey])
  }

  create (configKey, configValue) {
    return this.db.run(
      `INSERT INTO ${this.tableName} (config_key, config_value) VALUES (?, ?)`,
      [configKey, configValue])
  }

  createTable () {
    const sql = `
    CREATE TABLE IF NOT EXISTS ${this.tableName} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      config_key varchar(255) NOT NULL,
      config_value varchar(255) NOT NULL
    );`
    return this.db.run(sql)
  }
}

module.exports = ConfigRepository
