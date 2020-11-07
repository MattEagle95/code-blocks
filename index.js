global.__basedir = __dirname

const BootstrapService = require('./src/bootstrap')
const ExpressLoader = require('./src/express-loader')

const bootstrapService = new BootstrapService()
const expressLoader = new ExpressLoader()

bootstrapService.start()
  .then(() => {
    expressLoader.start()
  })
