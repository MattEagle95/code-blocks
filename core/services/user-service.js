"use strict";

const DBService = require('./db-service');

class UserService {
  findByName(name) {
    let stmt = DBService.db.prepare("SELECT rowid AS id, name, password FROM User WHERE name = ?");
    stmt.get("SELECT rowid AS id, name, password FROM User WHERE name = ?", function(err, row) {
      console.log(row.id + ": " + row.name + " - " + row.password);
  });
  }
}

module.exports = UserService