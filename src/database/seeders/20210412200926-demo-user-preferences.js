const userPreferences = [...Array(100)].map((userPreference, index) => (
  {
    userId: index + 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }
))

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('userPreferences', userPreferences)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('userPreferences', null, {})
  }
}
