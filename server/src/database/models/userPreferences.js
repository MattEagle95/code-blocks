module.exports = function (sequelize, DataTypes) {
  const UserPreferences = sequelize.define('userPreferences', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    drawerCollapsed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    timestamps: true
  })
  UserPreferences.associate = function (models) {
    UserPreferences.belongsTo(models.User)
  }
  return UserPreferences
}
