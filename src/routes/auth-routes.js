const AuthController = require('../controller/auth-controller')
const auth = require('../middleware/auth')
const validate = require('../middleware/validate')

const router = require('express').Router()

router.post('/login', AuthController.auth(true), validate, AuthController.auth())
router.post('/logout', auth, AuthController.auth(true), validate, AuthController.auth())

module.exports = router
