const { body } = require('express-validator')
const AuthController = require('../controller/auth.controller')
const validateMiddleware = require('../middleware/validate.middleware')

const router = require('express').Router()

const authController = new AuthController()

router.post('/', validateMiddleware, [
  body('name').notEmpty().ltrim().rtrim(),
  body('password').notEmpty()
], (req, res) => {
  const { name, password } = req.body

  authController.login(name, password)
    .then(() => {
      res.status(201).send()
    })
    .catch(error => {
      res.status(400).send(error)
    })
})

module.exports = router
