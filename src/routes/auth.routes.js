const { body } = require('express-validator')
const AuthController = require('../controller/auth.controller')
const validateMiddleware = require('../middleware/validate.middleware')
const LoggerFactory = require('../util/logger-factory')

const router = require('express').Router()

const logger = LoggerFactory.Logger('authRoutes')
const authController = new AuthController()

router.post('/', [
  body('name').notEmpty(),
  body('password').notEmpty()
], validateMiddleware, (req, res) => {
  const { name, password } = req.body

  authController.auth(name, password)
    .then(() => {
      res.status(201).send()
    })
    .catch(error => {
      logger.error(error)
      res.status(400).send(error)
    })
})

module.exports = router
