const path = require('path');

module.exports = {
  development: {
    username: 'postgres',
    password: 'postgres',
    database: 'tfc_survival_development',
    host: 'localhost',
    dialect: 'postgres',
    migrationStorage: 'json',
    migrationStoragePath: path.resolve(__dirname, '../db/sequelizeMeta.json'),
    seederStorage: 'json',
    seederStoragePath: path.resolve(__dirname, '../db/sequelizeData.json'),
  },
  test: {
    username: 'root',
    password: null,
    database: 'tfc_survival_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: null,
    database: 'tfc_survival_production',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};
