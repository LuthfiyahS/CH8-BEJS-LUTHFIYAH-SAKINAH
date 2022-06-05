'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Endpoint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.RoleToEndpoint, {foreignKey:'endpoint_id'})
      //this.hasMany(models.RoleToEndpoint, {foreignKey:"endpoint_id"})
    }
  }
  Endpoint.init({
    endpoint: DataTypes.STRING,
    method: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'endpoint',
    modelName: 'Endpoint',
  });
  return Endpoint;
};