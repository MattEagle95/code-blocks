module.exports = function (sequelize, DataTypes) {
  const UserRole = sequelize.define('userRole', {
  }, {
    timestamps: true
  })
  return UserRole
}
