const authMiddleware = require('../middleware/auth.middleware')

const router = require('express').Router()

router.get('/list', authMiddleware, (req, res) => {
})

module.exports = router
