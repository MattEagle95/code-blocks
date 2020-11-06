const express = require('express')
const app = express()
const port = 3000

const loggerFactory = require('./core/services/logger')
const logger = new loggerFactory().logger

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

const BootstrapService = require('./core/services/bootstrap-service')
const bootstrapService = new BootstrapService();
bootstrapService.start()
.then(() => {
  app.listen(port, () => {
    logger.info(`Example app listening at http://localhost:${port}`)
  })
})
