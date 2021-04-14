'use strict'

const fs = require('fs')
const crypto = require('crypto')
const consts = require('./config/consts.js')
const Env = require('./util/env')
const LoggerFactory = require('./util/logger-factory')
const db = require('./database/models')
const ExpressLoader = require('./express-loader')
const config = require('../storage/config/config.json')

class BootstrapService {
  constructor () {
    this.logger = LoggerFactory.Logger(this.constructor.name)
    this.expressLoader = new ExpressLoader()
  }

  async assertDatabaseConnectionOk () {
    try {
      await db.sequelize.authenticate()
      this.logger.info('database connected')
      await db.sequelize.sync({ force: true })
      // await db.models.User.create({ email: 'admin', password: 'test' })
      // await db.models.Role.create({ name: 'admin-role' })
      // return db.models.Role.findByPk(1).then((role) => {
      //   db.models.User.findByPk(1).then((user) => {
      //     user.addRole(role).then(() => {
      //       db.models.User.findAll({ raw: true }).then((users) => {
      //         console.log('Database connection OK!');
      //         console.log(users)
      //       })
      //     })
      //   })
      // });
    } catch (error) {
      this.logger.error(`unable to connect to database: ${error.message}`)
    }
  }

  async init () {
    this.logger.info('startup')

    this.checkEnvironment()

    const newConfig = {
      ...config,
      JWT_TOKEN: crypto.randomBytes(32).toString('hex')
    }
    fs.writeFileSync(consts.FILE_PATH_CONFIG, JSON.stringify(newConfig))
    this.logger.info('config file created')

    await this.assertDatabaseConnectionOk()

    // const exec = require('child_process').exec

    // const cmd = exec('npm run-script db:seed', function (err, stdout, stderr) {
    //   if (err) {
    //     // handle error
    //   }
    //   console.log(stdout)
    // })

    // await new Promise((resolve, reject) => {
    //   cmd.on('exit', function (code) {
    //     console.log('exit')
    //     resolve()
    //   })
    // })

    await this.expressLoader.init()

    this.logger.info('startup complete')
  }

  checkEnvironment () {
    if (!Env.getNodeEnv()) {
      this.logger.info(`no NODE_ENV environment var found. setting it to ${consts.NODE_ENV_DEVELOPMENT}`)
      Env.setNodeEnv(consts.NODE_ENV_DEVELOPMENT)
    }
    this.logger.info('environment: ' + Env.getNodeEnv())
  }
}

module.exports = BootstrapService
