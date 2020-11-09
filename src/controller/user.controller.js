'use strict'

const UserService = require('../services/user.service')

class UserController {
  constructor () {
    this.userService = new UserService()
  }

  get () {
    return new Promise((resolve, reject) => {
      this.userService.getAll()
        .then(users => {
          console.log('users')
          console.log(users)
          resolve([users])
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  find (id) {
    return new Promise((resolve, reject) => {
      this.userService.findById(id)
        .then(user => {
          resolve(user)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  create (name, password) {
    return new Promise((resolve, reject) => {
      this.userService.create(name, password)
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  update (id, name, password) {
    return new Promise((resolve, reject) => {
      this.userService.update(id, name, password)
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  delete (id) {
    return new Promise((resolve, reject) => {
      this.userService.delete(id)
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

module.exports = UserController
