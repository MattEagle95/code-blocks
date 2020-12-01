'use strict'

const UserService = require('../services/user.service')
const { cpu, drive, mem, os } = require('node-os-utils')

class UserController {
  constructor () {
    this.userService = new UserService()
  }

  get () {
    return new Promise((resolve, reject) => {
      this.userService.getAll()
        .then(users => {
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

  systeminfo () {
    return new Promise((resolve, reject) => {
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
          console.log('resolve')
          resolve([cpuPercentage, info, os.uptime(), oos, os.platform()])
        })
        .catch(error => {
          console.log(error)
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
