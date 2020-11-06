'use strict'

const consts = require('../config/consts.js')

class Env {

  static getNodeEnv() {
    return process.env.NODE_ENV
  }
  
  static setNodeEnv(env) {
    process.env.NODE_ENV = env
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

  static getPort() {
    return parseInt(process.env.PORT) || parseInt(consts.ENV_PORT)
  }
}

module.exports = Env