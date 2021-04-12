'use strict'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const consts = require('../config/consts.js')

const ConfigRepository = require('../db/repositories/config.repository')
const TokenRepository = require('../db/repositories/token.repository')
const UserService = require('../services/user.service')
const LoggerFactory = require('../util/logger-factory')

class SystemInfoController {
    constructor() {
        this.auditLogger = LoggerFactory.AuditLogger('SystemInfoController')
        this.userService = new UserService()
        this.configRepository = new ConfigRepository()
        this.tokenRepository = new TokenRepository()
    }

    systeminfo() {
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
                    resolve([cpuPercentage, info, os.uptime(), oos, os.platform()])
                })
                .catch(error => {
                    console.log(error)
                    reject(error)
                })
        })
    }
}

module.exports = SystemInfoController
