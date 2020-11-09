
'use strict'

const pm2 = require('pm2')
const Promise = require('bluebird')
const LoggerFactory = require('../util/logger-factory')

class PM2Controller {
  constructor () {
    this.logger = LoggerFactory.Logger(this.constructor.name)
  }

  list () {
    return new Promise((resolve, reject) => {
      pm2.connect(function (error) {
        if (error) {
          this.logger.error(error)
          reject(error)
        }

        return pm2.list((error, list) => {
          if (error) {
            this.logger.error(error)
            reject(error)
          }

          resolve(list)
        })
      })
    })
  }

  start (name, script) {
    return new Promise((resolve, reject) => {
      pm2.connect(function (error) {
        if (error) {
          this.logger.error(error)
          reject(error)
        }

        pm2.start({
          name: name,
          script: script
        }, function (error, apps) {
          if (error) {
            this.logger.error(error)
            reject(error)
          }

          resolve(apps)
        })
      })
    })
  }

  flush (name) {
    return new Promise((resolve, reject) => {
      pm2.connect(function (error) {
        if (error) {
          this.logger.error(error)
          reject(error)
        }

        pm2.flush(name, (error, proc) => {
          if (error) {
            this.logger.error(error)
            reject(error)
          }

          resolve(proc)
        })
      })
    })
  }

  reload (name) {
    return new Promise((resolve, reject) => {
      pm2.connect(function (error) {
        if (error) {
          this.logger.error(error)
          reject(error)
        }

        pm2.reload(name, {
          autorestart: false
        }, function (error, apps) {
          if (error) {
            this.logger.error(error)
            reject(error)
          }

          resolve(apps)
        })
      })
    })
  }

  restart (name) {
    return new Promise((resolve, reject) => {
      pm2.connect(function (error) {
        if (error) {
          this.logger.error(error)
          reject(error)
        }

        pm2.restart(name, (error, proc) => {
          if (error) {
            this.logger.error(error)
            reject(error)
          }

          resolve(proc)
        })
      })
    })
  }

  stop (name) {
    return new Promise((resolve, reject) => {
      pm2.connect(function (error) {
        if (error) {
          this.logger.error(error)
          reject(error)
        }

        pm2.stop(name, (error, proc) => {
          if (error) {
            this.logger.error(error)
            reject(error)
          }

          resolve(proc)
        })
      })
    })
  }
}

module.exports = PM2Controller
