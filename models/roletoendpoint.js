'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoleToEndpoint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.RoleUser, {foreignKey:'role_id', as: 'role'})
      this.belongsTo(models.Endpoint, {foreignKey:'endpoint_id',as:'endpoint'})
    }
  }
  RoleToEndpoint.init({
    role_id: DataTypes.INTEGER,
    endpoint_id: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'role_to_endpoint',
    modelName: 'RoleToEndpoint',
  });
  return RoleToEndpoint;
};