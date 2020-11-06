const express = require('express')
const app = express()

global.__basedir = __dirname;

const loggerFactory = require('./core/services/logger')
const logger = new loggerFactory().logger
const Env = require('./core/services/env')

var cors = require('cors')
app.use(cors())

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Import routes
let routes = require("./core/routes/routes")
let apiRoutes = require("./core/routes/api-routes")
let authRoutes = require("./core/routes/auth-routes")

//Use API routes in the App
app.use('/', routes)
app.use('/api', apiRoutes)
app.use('/auth', authRoutes)

const port = Env.getPort();
const BootstrapService = require('./core/services/bootstrap-service')
const bootstrapService = new BootstrapService();
bootstrapService.start()
.then(() => {
  app.listen(port, () => {
    logger.info(`server listening on port: ${port}`)
  })
})
