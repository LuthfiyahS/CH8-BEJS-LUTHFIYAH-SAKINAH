'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Otp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.UserGames, {foreignKey: 'user_id', as: 'user'})
    }
  }
  Otp.init({
    user_id: DataTypes.INTEGER,
    email: DataTypes.STRING,
    otp: DataTypes.INTEGER,
    expire_in: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'otps',
    modelName: 'Otp',
  });
  return Otp;
};