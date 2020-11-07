const { reject } = require('bluebird')
const Promise = require('bluebird')
const { body } = require('express-validator')
const LoggerFactory = require('..//util/logger-factory')
const UserRepository = require('../db/user-repository')
const UserService = require('../services/user-service')
const bcrypt = require('bcryptjs')

class UserController {
  constructor () {
    this.logger = new LoggerFactory.Logger(this.constructor.name)
    this.userRepo = new UserRepository()
  }

  find (val = false) {
    if (val) {
      return [
        body('id').isNumeric()
      ]
    }

    return function (req, res) {
      const { id } = req.body

      this.UserRepository.findById(id)
        .then(user => {
          res.status(201).send(user)
        })
        .catch(error => {
          res.status(400).send(error)
        })
    }
  }

  all (val = false) {
    return function (req, res) {
      this.UserRepository.getAll()
        .then(users => {
          res.status(201).send(users)
        })
        .catch(error => {
          res.status(400).send(error)
        })
    }
  }

  create (val = false) {
    if (val) {
      return [
        body('name').isString(),
        body('password').isString()
      ]
    }

    return function (req, res) {
      const { name, password } = req.body

      this.UserService.create(name, password)
        .then(() => {
          res.status(201).send()
        })
        .catch(error => {
          res.status(400).send(error)
        })
    }
  }

  update (val = false) {
    if (val) {
      return [
        body('id').isNumeric(),
        body('name').isString(),
        body('password').isString()
      ]
    }

    return function (req, res) {
      const { id } = req.body

      this.UserRepository.findById(id)
        .then(user => {
          res.status(201).send(user)
        })
        .catch(error => {
          res.status(400).send(error)
        })
    }
  }

  delete (val = false) {
    if (val) {
      return [
        body('id').isNumeric()
      ]
    }

    return function (req, res) {
      const { id } = req.body

      this.UserRepository.delete(id)
        .then(() => {
          res.status(201).send()
        })
        .catch(error => {
          res.status(400).send(error)
        })
    }
  }
}

module.exports = UserController
