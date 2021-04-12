'use strict'

const db = require('../db')

class RoleRepository {
    constructor() {
        this.db = db
        this.tableName = 'RoleRepository'
    }

    findById(id) {
        return this.db.get(
            `SELECT * FROM ${this.tableName} WHERE id = ?`,
            [id])
    }

    getAll() {
        return this.db.get(
            `SELECT * FROM ${this.tableName}`)
    }

    create(name) {
        return this.db.run(
            `INSERT INTO ${this.tableName} (name) VALUES (?)`,
            [name])
    }

    delete(id) {
        return this.db.run(
            `DELETE FROM ${this.tableName} WHERE id = ?`,
            [id]
        )
    }

    createTable() {
        const sql = `
    CREATE TABLE IF NOT EXISTS ${this.tableName} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
    );`
        return this.db.run(sql)
    }
}

module.exports = RoleRepository
