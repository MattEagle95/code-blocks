const { body, param } = require('express-validator')
const UserController = require('../controller/user.controller')
const authMiddleware = require('../middleware/auth.middleware')
const validateMiddleware = require('../middleware/validate.middleware')

const router = require('express').Router()

const userController = new UserController()

router.get('/', (req, res) => {
  userController.get()
    .then(users => {
      res.status(201).send(users)
    })
    .catch(error => {
      res.status(400).send(error)
    })
})

router.get('/:id', [
  param('id').isInt()
], validateMiddleware, (req, res) => {
  const { id } = req.params

  userController.find(id)
    .then(user => {
      res.status(201).send(user)
    })
    .catch(error => {
      res.status(400).send(error)
    })
})

router.post('/', validateMiddleware, [
  body('name').notEmpty().ltrim().rtrim(),
  body('password').notEmpty(),
  body('passwordAgain').notEmpty()
], (req, res) => {
  const { name, password } = req.body

  userController.create(name, password)
    .then(() => {
      res.status(201).send()
    })
    .catch(error => {
      res.status(400).send(error)
    })
})

router.put('/', authMiddleware, [
  body('id').isInt(),
  body('name').notEmpty().ltrim().rtrim(),
  body('password').notEmpty(),
  body('passwordAgain').notEmpty()
], (req, res) => {
  const { id, name, password } = req.body

  userController.update(id, name, password)
    .then(() => {
      res.status(201).send()
    })
    .catch(error => {
      res.status(400).send(error)
    })
})

router.delete('/:id', authMiddleware, [
  body('id').isInt()
], (req, res) => {
  const { id } = req.body

  userController.delete(id)
    .then(() => {
      res.status(201).send()
    })
    .catch(error => {
      res.status(400).send(error)
    })
})

module.exports = router
