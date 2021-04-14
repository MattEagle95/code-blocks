const bcrypt = require('bcryptjs')

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    password: {
      type: DataTypes.VIRTUAL,
      set: function (val) {
        this.setDataValue('passwordHash', bcrypt.hashSync(val, bcrypt.genSaltSync(10)))
      }
    }
  }, {
    timestamps: true
  })

  User.associate = function (models) {
    User.hasOne(models.UserPreferences)
    User.belongsToMany(models.Role, { through: models.UserRole })
    User.hasMany(models.Template)
  }
  return User
}
