const faker = require('faker')
const roles = [...Array(1)].map((userPreference, index) => (
  {
    name: faker.lorem.word(),
    description: faker.lorem.sentence(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
))

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('role', roles)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('role', null, {})
  }
}
