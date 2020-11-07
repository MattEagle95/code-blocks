'use strict'

const AppDAO = require('./dao')

class TokenRepository {
  constructor () {
    this.dao = AppDAO
    this.tableName = 'Token'
  }

  getById (id) {
    return this.dao.get(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id])
  }

  getByName (name) {
    return this.dao.get(
      `SELECT * FROM ${this.tableName} WHERE name = ?`,
      [name])
  }

  create (userId, token) {
    return this.dao.run(
      `INSERT INTO ${this.tableName} (user_id, token) VALUES (?, ?)`,
      [userId, token])
  }

  delete (id) {
    return this.dao.run(
      `DELETE FROM ${this.tableName} WHERE id = ?`,
      [id]
    )
  }

  createTable () {
    const sql = `
    CREATE TABLE IF NOT EXISTS ${this.tableName} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL,

      FOREIGN KEY(user_id) REFERENCES User(id)
    );`
    return this.dao.run(sql)
  }
}

module.exports = TokenRepository
