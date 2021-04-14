const faker = require('faker')
const users = [...Array(100)].map((user) => (
  {
    email: faker.internet.email(),
    passwordHash: 'test',
    createdAt: new Date(),
    updatedAt: new Date()
  }
))

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('user', users)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('user', null, {})
  }
}
