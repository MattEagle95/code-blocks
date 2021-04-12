'user strict'

const Promise = require('bluebird')
const LoggerFactory = require('../util/logger-factory')
const UserPreferencesRepository = require('../db/repositories/UserPreferences.repository')

class RoleService {
    constructor() {
        this.logger = LoggerFactory.Logger(this.constructor.name)
        this.repository = new UserPreferencesRepository()
    }

    findById(id) {
        return new Promise((resolve, reject) => {
            this.repository.findById(id)
                .then(data => {
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    getAll() {
        return new Promise((resolve, reject) => {
            this.repository.getAll()
                .then(data => {
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    create(name) {
        return new Promise((resolve, reject) => {
            this.repository.create(name)
                .then((data) => {
                    this.logger.info('create role ' + name + ' id ' + data.id)
                    resolve(data.id)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    createTable() {
        return new Promise((resolve, reject) => {
            this.repository.createTable()
                .then(() => {
                    resolve()
                })
                .catch(error => {
                    reject(error)
                })
        })
    }
}

module.exports = RoleService
