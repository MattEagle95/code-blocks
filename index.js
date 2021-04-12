const BootstrapService = require('./src/bootstrap')

const path = require('path')
global.__basedir = path.resolve()

const bootstrapService = new BootstrapService()

bootstrapService.init()