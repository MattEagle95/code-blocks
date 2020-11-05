"use strict";

const DBService = require('./db-service');

class InstallService {

  install() {
    DBService.getDB().serialize(function() {
      db.run(`
      CREATE TABLE User (
        name varchar(255) NOT NULL,
        password varchar(255) NOT NULL
      );
      `);
     
      var stmt = db.prepare("INSERT INTO User VALUES (?, ?)");
      for (var i = 0; i < 10; i++) {
          stmt.run("Name " + i, "Passwort " + i);
      }
      stmt.finalize();
     
      db.each("SELECT rowid AS id, name, password FROM User", function(err, row) {
          console.log(row.id + ": " + row.name + " - " + row.password);
      });
    });
  }
}

module.exports = InstallService;