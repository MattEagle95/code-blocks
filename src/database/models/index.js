const fs = require('fs')
const path = require('path')
const { Sequelize, DataTypes } = require('sequelize')
const logger = require('../../util/logger-factory').Logger()
const config = require('../../config/config.json')

const filebasename = path.basename(__filename)
const sequelize = new Sequelize({
  dialect: config.development.dialect,
  storage: config.development.storage,
  define: { freezeTableName: true },
  logging: true
})
const models = {}

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

fs
  .readdirSync(__dirname)
  .filter((file) => {
    const returnFile = (file.indexOf('.') !== 0) &&
            (file !== filebasename) &&
            (file.slice(-3) === '.js')
    return returnFile
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes)
    logger.debug(`found db model: ${capitalizeFirstLetter(model.name)}`)
    models[capitalizeFirstLetter(model.name)] = model
  })

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models)
  }
})

module.exports = { sequelize, models }
