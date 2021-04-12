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

  findByEmail (email) {
    return this.db.get(
      `SELECT * FROM ${this.tableName} WHERE email = ?`,
      [email])
  }

  getAll () {
    return this.db.all(
      `SELECT * FROM ${this.tableName}`
    )
  }

  create (email, password) {
    return this.db.run(
      `INSERT INTO ${this.tableName} (email, password, lastLogin, registrationDate) VALUES (?, ?, ?, ?)`,
      [email, password, new Date(), new Date()])
  }

  update (email, password) {
    return this.db.run(
      `UPDATE ${this.tableName} SET email = ?, password = ?`,
      [email, password])
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
      email varchar(255) NOT NULL,
      password varchar(255) NOT NULL,
      lastLogin varchar(255) NOT NULL,
      registrationDate varchar(255) NOT NULL
    );`

    return this.db.run(sql)
  }
}

module.exports = UserRepository
