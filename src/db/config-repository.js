'use strict'

const AppDAO = require('./dao')

class ConfigRepository {
  constructor () {
    this.dao = AppDAO
    this.tableName = 'Config'
  }

  getById (id) {
    return this.dao.get(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id])
  }

  getByConfigKey (configKey) {
    return this.dao.get(
      `SELECT * FROM ${this.tableName} WHERE config_key = ?`,
      [configKey])
  }

  create (configKey, configValue) {
    return this.dao.run(
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
    return this.dao.run(sql)
  }
}

module.exports = ConfigRepository
