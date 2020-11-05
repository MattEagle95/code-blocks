"use strict";

const sqlite3 = require('sqlite3').verbose();

class DBService {

  constructor() {
    console.log("const");
    this.db = this.connect();
  }

  connect() {
    return new sqlite3.Database('./db/main.db', (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to the database.');
    });
  }

  getDB() {
    return this.db;
  }
}

module.exports = new DBService();