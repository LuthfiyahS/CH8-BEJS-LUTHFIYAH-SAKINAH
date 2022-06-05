'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoleUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.UserGames, {foreignKey: 'role_id', as: 'role'});
      this.hasMany(models.RoleToEndpoint, {foreignKey:'role_id'});
    }
  }
  RoleUser.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'role_user',
    modelName: 'RoleUser',
  });
  return RoleUser;
};