'use strict'

class Env {

  static getEnv() {
    return process.env.NODE_ENV
  }

  static checkDevelopment() {
    return process.env.NODE_ENV === "development"
  }

  static setEnv(stage) {
    process.env.NODE_ENV = stage
  }
}

module.exports = Env