const UserController = require('../controller/user.controller')
const router = require('express').Router()

const userController = new UserController()

router.get('/', (req, res, next) => {
    userController.systeminfo()
        .then(systeminfo => {
            res.status(201)
            res.body = systeminfo
            next()
        })
        .catch(error => {
            res.status(400)
            res.body = error
            next()
        })
})

module.exports = router
