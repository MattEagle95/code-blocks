const auth = require('../middleware/auth')
const AuthService = require('../services/auth-service')

const router = require('express').Router()

router.post('/login', (req, res) => {
  const authService = new AuthService()
  authService.login(req.body.name, req.body.password)
    .then(token => {
      res.status(201).send(token)
    })
    .catch(error => {
      res.status(400).send(error)
    })
})

router.get('/auth-test', auth, (req, res) => {
  res.send('hi')
})

module.exports = router
