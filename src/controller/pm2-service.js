const pm2 = require('pm2')
const Promise = require('bluebird')
const LoggerFactory = require('..//util/logger-factory')

class PM2Service {
  constructor () {
    this.logger = new LoggerFactory.Logger('PM2Service')
  }

  init () {
    return new Promise((resolve, reject) => {
      this.logger.info('pm2 service init')
      pm2.connect(function (err) {
        if (err) {
          this.logger.error(err)
          process.exit(2)
        }
      })
    })
  }
}

module.exports = PM2Service
