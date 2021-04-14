const { cpu, mem, os } = require('node-os-utils')
const router = require('express').Router()

router.get('/', (req, res, next) => {
  cpu.usage()
    .then(cpuPercentage => {
      return cpuPercentage
    })
    .then(cpuPercentage => {
      return mem.info()
        .then(info => {
          return [cpuPercentage, info]
        })
    })
    .then(function ([cpuPercentage, info]) {
      return os.oos()
        .then(oos => {
          return [cpuPercentage, info, oos]
        })
    })
    .then(function ([cpuPercentage, info, oos]) {
      res.status(201)
      res.body = [cpuPercentage, info, os.uptime(), oos, os.platform()]
      next()
    })
    .catch(error => {
      res.status(400)
      res.body = error
      next()
    })
})

module.exports = router
