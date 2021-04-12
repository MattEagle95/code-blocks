'user strict'

const Promise = require('bluebird')
const LoggerFactory = require('../util/logger-factory')
const UserPreferencesRepository = require('../db/repositories/UserPreferences.repository')

class UserPreferencesService {
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

    create(userId, drawerCollapsed, tableSize, tableRowsPerPage) {
        return new Promise((resolve, reject) => {
            this.repository.create(userId, drawerCollapsed, tableSize, tableRowsPerPage)
                .then(() => {
                    this.logger.info('create preferences for ' + userId + ' drawerCollapsed ' + drawerCollapsed)
                    resolve()
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

module.exports = UserPreferencesService
