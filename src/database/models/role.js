module.exports = function (sequelize, DataTypes) {
  const Role = sequelize.define('role', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true
  })
  Role.associate = function (models) {
    Role.belongsToMany(models.User, { through: models.UserRole })
  }
  return Role
}
