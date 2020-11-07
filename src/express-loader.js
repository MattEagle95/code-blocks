'user strict'

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Env = require('./util/env')
const LoggerFactory = require('./util/logger-factory')

const apiRoutes = require('./routes/pm2.routes')
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')

class ExpressLoader {
  constructor () {
    this.logger = LoggerFactory.Logger(this.constructor.name)
  }

  start () {
    const app = express()
    const port = Env.getPort()

    app.use(cors())
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    this.registerRoutes(app)

    app.listen(port, () => {
      this.logger.info(`server listening on port: ${port}`)
    })
  }

  registerRoutes (app) {
    app.use('/api', apiRoutes)
    app.use('/auth', authRoutes)
    app.use('/user', userRoutes)
  }
}

module.exports = ExpressLoader
