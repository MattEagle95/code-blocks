const PM2Controller = require('../controller/pm2.controller')

const router = require('express').Router()

const pm2Controller = new PM2Controller()

router.get('/list', (req, res) => {
  pm2Controller.list()
    .then(list => {
      res.status(201).send(list)
    })
    .catch(error => {
      res.status(400).send(error)
    })
})

module.exports = router
