const path = require("path");
const { log } = require("../misc/logger");
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const NODE_ENV = process.env.NODE_ENV;
const DB_USER = process.env["DB_USER_" + NODE_ENV];
const DB_PASSWORD = process.env["DB_PASSWORD_" + NODE_ENV];

module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: "tfc_survival_development",
    host: "localhost",
    dialect: "mysql",
    migrationStorage: "json",
    migrationStoragePath: path.resolve(__dirname, "../db/sequelizeMeta.json"),
    seederStorage: "json",
    seederStoragePath: path.resolve(__dirname, "../db/sequelizeData.json"),
    logging: (...data) => log('[DB][DEBUG]', ...data),
  },
  test: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: "tfc_survival_test",
    host: "localhost",
    dialect: "postgres",
  },
  production: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: "tfc_survival_development",
    host: "localhost",
    dialect: "mysql",
    migrationStorage: "json",
    migrationStoragePath: path.resolve(__dirname, "../db/sequelizeMeta.json"),
    seederStorage: "json",
    seederStoragePath: path.resolve(__dirname, "../db/sequelizeData.json"),
    logging: (...data) => log('[DB][DEBUG]', ...data),
  },
};
