const express = require('express')
const app = express()

global.__basedir = __dirname

const LoggerFactory = require('./core/services/logger')
const logger = new LoggerFactory().logger
const Env = require('./core/services/env')

const cors = require('cors')
app.use(cors())

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Import routes
const routes = require('./core/routes/routes')
const apiRoutes = require('./core/routes/api-routes')
const authRoutes = require('./core/routes/auth-routes')

// Use API routes in the App
app.use('/', routes)
app.use('/api', apiRoutes)
app.use('/auth', authRoutes)

const port = Env.getPort()
const BootstrapService = require('./core/services/bootstrap-service')
const bootstrapService = new BootstrapService()
bootstrapService.start()
  .then(() => {
    app.listen(port, () => {
      logger.info(`server listening on port: ${port}`)
    })
  })
