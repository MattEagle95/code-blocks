const { body, param } = require('express-validator')
const UserController = require('../controller/user.controller')
const db = require('../database/models/')
const authMiddleware = require('../middleware/auth.middleware')
const validateMiddleware = require('../middleware/validate.middleware')
const router = require('express').Router()

const userController = new UserController()

router.get('/', (req, res, next) => {
  db.models.User.findAll({ attributes: { exclude: ['passwordHash'] }, raw: true })
    .then(users => {
      res.status(201)
      res.body = users
      next()
    })
    .catch(error => {
      res.status(400)
      res.body = error
      next()
    })
})

router.get('/:id', [
  param('id').isInt()
], validateMiddleware, (req, res, next) => {
  const { id } = req.params

  userController.find(id)
    .then(user => {
      res.status(201)
      res.body = user
      next()
    })
    .catch(error => {
      res.status(400)
      res.body = error
      next()
    })
})

router.post('/', validateMiddleware, [
  body('email').notEmpty().ltrim().rtrim(),
  body('password').notEmpty(),
  body('passwordConfirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password')
    }

    return true
  })
], (req, res) => {
  const { email, password } = req.body

  userController.create(email, password)
    .then(user => {
      res.status(201)
      res.body = user
      next()
    })
    .catch(error => {
      res.status(400)
      res.body = error
      next()
    })
})

router.put('/', validateMiddleware, [
  param('id').isInt(),
  body('email').notEmpty().ltrim().rtrim()
], (req, res) => {
  const { id, email } = req.body

  userController.update(id, email)
    .then(user => {
      res.status(201)
      res.body = user
      next()
    })
    .catch(error => {
      res.status(400)
      res.body = error
      next()
    })
})

router.put('/updatePassword', validateMiddleware, [
  param('id').isInt(),
  body('password').notEmpty(),
  body('passwordConfirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password')
    }

    return true
  })
], (req, res) => {
  const { id, email } = req.body

  userController.updatePassword(id, email)
    .then(user => {
      res.status(201)
      res.body = user
      next()
    })
    .catch(error => {
      res.status(400)
      res.body = error
      next()
    })
})

router.delete('/:id', authMiddleware, [
  body('id').isInt()
], (req, res) => {
  const { id } = req.body

  userController.delete(id)
    .then(user => {
      res.status(201)
      res.body = user
      next()
    })
    .catch(error => {
      res.status(400)
      res.body = error
      next()
    })
})

module.exports = router
