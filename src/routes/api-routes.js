const router = require('express').Router()
const pm2 = require('pm2')

router.get('/status', (req, res) => {
  pm2.connect(function (err) {
    if (err) {
      console.error(err)
      process.exit(2)
    }

    pm2.list((err, list) => {
      res.send(list)
    })
  })
})

router.get('/logs', (req, res) => {
  res.sendFile('/home/pi/.pm2/logs/' + req.query.name + '-out.log')
})

router.post('/start', function (req, res) {
  pm2.connect(function (err) {
    if (err) {
      console.error(err)
      process.exit(2)
    }

    pm2.start({
      name: req.body.name,
      script: req.body.script
    }, function (err, apps) {
      pm2.disconnect()
    })
  })
})

router.post('/flush', function (req, res) {
  pm2.connect(function (err) {
    if (err) {
      console.error(err)
      process.exit(2)
    }

    pm2.flush(req.body.name, (err, proc) => {
      res.send(proc)
    })
  })
})

router.post('/reload', function (req, res) {
  pm2.connect(function (err) {
    if (err) {
      console.error(err)
      process.exit(2)
    }

    pm2.reload(req.body.name, {
      autorestart: false
    }, function (err, apps) {
      pm2.disconnect()
    })
  })
})

router.post('/restart', function (req, res) {
  pm2.connect(function (err) {
    if (err) {
      console.error(err)
      process.exit(2)
    }

    pm2.restart(req.body.name, (err, proc) => {
      res.send(proc)
    })
  })
})

router.post('/stop', function (req, res) {
  pm2.connect(function (err) {
    if (err) {
      console.error(err)
      process.exit(2)
    }

    pm2.stop(req.body.name, (err, proc) => {
      res.send(proc)
    })
  })
})
// Export API routes
module.exports = router
