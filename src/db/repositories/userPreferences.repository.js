'use strict'

const db = require('../db')

class UserPreferencesRepository {
  constructor () {
    this.db = db
    this.tableName = 'UserPreferences'
  }

  findById (id) {
    return this.db.get(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id])
  }

  getAll () {
    return this.db.get(
      `SELECT * FROM ${this.tableName}`)
  }

  create (userId, drawerCollapsed, tableSize, tableRowsPerPage) {
    return this.db.run(
      `INSERT INTO ${this.tableName} (userId, drawerCollapsed, tableSize, tableRowsPerPage) VALUES (?, ?, ?, ?)`,
      [userId, drawerCollapsed, tableSize, tableRowsPerPage])
  }

  delete (id) {
    return this.db.run(
      `DELETE FROM ${this.tableName} WHERE id = ?`,
      [id]
    )
  }

  createTable () {
    const sql = `
    CREATE TABLE IF NOT EXISTS ${this.tableName} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      drawerCollapsed TEXT,
      tableSize TEXT,
      tableRowsPerPage TEXT,

      FOREIGN KEY(userId) REFERENCES User(id)
    );`
    return this.db.run(sql)
  }
}

module.exports = UserPreferencesRepository
