const auth = require('../middleware/auth')
const UserRepository = require('../db/user-repository')

const router = require('express').Router()

router.post('/update', (req, res) => {
  const userRepository = new UserRepository()
})

module.exports = router
