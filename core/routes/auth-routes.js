const AuthService = require('../services/auth-service')

let router = require('express').Router();

router.post('/login', (req, res) => {
  const authService = new AuthService();
  console.log(req.body)
  authService.login(req.body.name, req.body.password)
  .then(token => {
    res.status(201).send(token)
  })
  .catch(error => {
    res.status(400).send(error)
  });
})

module.exports = router;