'use strict'

const DB = require('./db')

class TokenRepository {
  constructor () {
    this.db = DB
    this.tableName = 'Token'
  }

  findByUserIdAndToken (userId, token) {
    return this.db.get(
      `SELECT * FROM ${this.tableName} WHERE user_id = ? AND token = ?`,
      [userId, token])
  }

  getAll () {
    return this.db.get(
      `SELECT * FROM ${this.tableName}`)
  }

  create (userId, token) {
    return this.db.run(
      `INSERT INTO ${this.tableName} (user_id, token) VALUES (?, ?)`,
      [userId, token])
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
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL,

      FOREIGN KEY(user_id) REFERENCES User(id)
    );`
    return this.db.run(sql)
  }
}

module.exports = TokenRepository
