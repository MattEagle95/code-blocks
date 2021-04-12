'user strict'

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Env = require('./util/env')
const LoggerFactory = require('./util/logger-factory')

const apiRoutes = require('./routes/pm2.routes')
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const systemInfoRoutes = require('./routes/systemInfo.routes')
const authMiddleware = require('./middleware/auth.middleware')
const auditlogMiddleware = require('./middleware/auditlog.middleware')

class ExpressLoader {
  constructor () {
    this.logger = LoggerFactory.Logger(this.constructor.name)
  }

  async init () {
    return new Promise((resolve, reject) => {
      const app = express()
      const port = Env.getPort()

      app.use(cors())
      app.use(bodyParser.json())
      app.use(bodyParser.urlencoded({ extended: true }))

      this.registerRoutes(app)

      app.listen(port, () => {
        resolve()
        this.logger.info(`server listening on port: ${port}`)
      })
    })
  }

  registerRoutes (app) {
    app.use('/pm2', apiRoutes)
    app.use('/auth', authRoutes)
    app.use('/user', userRoutes, auditlogMiddleware)
    app.use('/systeminfo', authMiddleware, systemInfoRoutes, auditlogMiddleware)
  }
}

module.exports = ExpressLoader
