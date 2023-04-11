'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class alums extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  alums.init({
    name: DataTypes.TEXT,
    password: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'alums',
  });
  return alums;
};