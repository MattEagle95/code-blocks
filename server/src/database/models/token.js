module.exports = function (sequelize, DataTypes) {
  const Token = sequelize.define('token', {
    token: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    timestamps: true
  })
  Token.associate = function (models) {
    Token.belongsTo(models.User)
  }
  return Token
}
