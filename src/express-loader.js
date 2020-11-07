'user strict'

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Env = require('./util/env')
const LoggerFactory = require('./util/logger-factory')

const routes = require('./routes/routes')
const apiRoutes = require('./routes/api-routes')
const authRoutes = require('./routes/auth-routes')

class ExpressLoader {
  constructor () {
    this.logger = LoggerFactory.Logger(this.constructor.name)
  }

  start () {
    const port = Env.getPort()
    const app = express()

    app.use(cors())
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    this.registerRoutes(app)

    app.listen(port, () => {
      this.logger.info(`server listening on port: ${port}`)
    })
  }

  registerRoutes (app) {
    app.use('/', routes)
    app.use('/api', apiRoutes)
    app.use('/auth', authRoutes)
  }
}

module.exports = ExpressLoader
