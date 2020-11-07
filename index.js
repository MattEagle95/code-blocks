const express = require('express')
const app = express()

global.__basedir = __dirname

const logger = require('./src/util/logger-factory').Logger('index')
const Env = require('./src/util/env')

const cors = require('cors')
app.use(cors())

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Import routes
const routes = require('./src/routes/routes')
const apiRoutes = require('./src/routes/api-routes')
const authRoutes = require('./src/routes/auth-routes')

// Use API routes in the App
app.use('/', routes)
app.use('/api', apiRoutes)
app.use('/auth', authRoutes)

const port = Env.getPort()
const BootstrapService = require('./src/controller/bootstrap-service')
const bootstrapService = new BootstrapService()
bootstrapService.start()
  .then(() => {
    app.listen(port, () => {
      logger.info(`server listening on port: ${port}`)
    })
  })
