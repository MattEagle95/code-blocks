"use strict";

const AppDAO = require('./dao')

class UserRepository {
  constructor() {
    this.dao = AppDAO
  }

  getById(id) {
    return this.dao.get(
      `SELECT * FROM User WHERE id = ?`,
      [id])
  }

  getByName(name) {
    return this.dao.get(
      `SELECT * FROM User WHERE name = ?`,
      [name])
  }

  create(name, password) {
    return this.dao.run(
      'INSERT INTO User (name, password) VALUES (?, ?)',
      [name, password])
  }

  delete(id) {
    return this.dao.run(
      `DELETE FROM User WHERE id = ?`,
      [id]
    )
  }

  createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS User (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name varchar(255) NOT NULL,
      password varchar(255) NOT NULL
    );`
    return this.dao.run(sql)
  }
}

module.exports = UserRepository;