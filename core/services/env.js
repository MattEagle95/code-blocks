'use strict'

const consts = require('../config/consts.js')

class Env {

  static getNodeEnv() {
    return process.env.NODE_ENV
  }
  
  static setNodeEnv(stage) {
    process.env.NODE_ENV = stage
  }

  static checkNodeEnvDevelopment() {
    return process.env.NODE_ENV === consts.NODE_ENV_DEVELOPMENT
  }

  static getBaseDir() {
    return __basedir + '\\'
  }

  static getAbsolutePath(path) {
    return this.getBaseDir() + path
  }
}

module.exports = Env