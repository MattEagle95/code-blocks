'use strict'

const DB = require('./db/db')

class Cleanup {
  static init () {
    console.log('cleanup init')

    const others = ['SIGINT', 'SIGTERM']
    others.forEach((eventType) => {
      process.on(eventType, this.exitRouter.bind(null, { exit: true }))
    })
  }

  static exitRouter (options, exitCode) {
    if (exitCode || exitCode === 0) {
      process.exitTimeoutId = setTimeout(() => process.exit, 5000)
      console.log(`ExitCode ${exitCode}`)
      console.log(`ExitCode ${exitCode}`)
    }
    if (options.exit) process.exit()
  }

  static exitHandler (exitCode) {
    process.exitTimeoutId = setTimeout(() => process.exit, 5000)
    console.log(`ExitCode ${exitCode}`)
    console.log('Exiting finally...')
  }

  static cleanup () {
    console.log('test')
    console.log('test')
    DB.disconnect()
    console.log('test')
  }
}

module.exports = Cleanup
