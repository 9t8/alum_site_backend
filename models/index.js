'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
// This checks if the database configuration specifies a use_env_variable key,
// which would indicate that the connection information is stored in an environment variable
if (config.use_env_variable) {
  // If use_env_variable is specified,
  // this creates a new Sequelize database connection using the environment variable specified in config.use_env_variable.
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // If use_env_variable is not specified,
  // this creates a new Sequelize database connection using the values specified in config
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
// This reads the current directory and filters out all files that do not match the criteria for a Sequelize model file.
    .readdirSync(__dirname)
    .filter((file) => {
      return (
        file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
      );
    })
    .forEach((file) => {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      // This adds the model to the db object using the model name as the key.
      db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
