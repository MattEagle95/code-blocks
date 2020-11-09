'use strict'

const DB = require('../db')

class UserRepository {
  constructor () {
    this.db = DB
    this.tableName = 'User'
  }

  findById (id) {
    return this.db.get(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id])
  }

  findByName (name) {
    return this.db.get(
      `SELECT * FROM ${this.tableName} WHERE name = ?`,
      [name])
  }

  getAll () {
    return this.db.get(
      `SELECT * FROM ${this.tableName}`
    )
  }

  create (name, password) {
    return this.db.run(
      `INSERT INTO ${this.tableName} (name, password) VALUES (?, ?)`,
      [name, password])
  }

  update (name, password) {
    return this.db.run(
      `UPDATE ${this.tableName} SET name = ?, password = ?`,
      [name, password])
  }

  delete (id) {
    return this.db.run(
      `DELETE FROM ${this.tableName} WHERE id = ?`,
      [id]
    )
  }

  createTable () {
    const sql = `
    CREATE TABLE IF NOT EXISTS User (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name varchar(255) NOT NULL,
      password varchar(255) NOT NULL
    );`

    return this.db.run(sql)
  }
}

module.exports = UserRepository
