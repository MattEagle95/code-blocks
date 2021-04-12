module.exports = function (sequelize, DataTypes) {
  const Template = sequelize.define('template', {
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
  Template.associate = function (models) {
    Template.belongsTo(models.User)
  }
  return Template
}
