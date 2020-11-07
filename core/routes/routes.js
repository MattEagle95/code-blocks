// initialize express router
const router = require('express').Router()
// set default API response
router.get('/', function (req, res) {
  res.json({
    status: 'API Works',
    message: 'Welcome to FirstRest API'
  })
})
// Export API routes
module.exports = router
