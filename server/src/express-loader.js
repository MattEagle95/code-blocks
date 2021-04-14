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

const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for JSONPlaceholder',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html'
    },
    contact: {
      name: 'JSONPlaceholder',
      url: 'https://jsonplaceholder.typicode.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    }
  ]
}

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/routes/user.routes.js']
}

const swaggerSpec = swaggerJSDoc(options)

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

      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

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
