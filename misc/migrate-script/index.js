const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const NODE_ENV = process.env.NODE_ENV;
const DB_USER = process.env["DB_USER_" + NODE_ENV];
const DB_PASSWORD = process.env["DB_PASSWORD_" + NODE_ENV];

const mysql = require('mysql2');

const bcrypt = require('bcrypt');

const uuid = require('uuid');

const sourceConnect = mysql.createConnection({
  user: DB_USER,
  password: DB_PASSWORD,
  host: 'localhost',
  database: 'tfc',
});

const targetConnect = mysql.createConnection({
  user: DB_USER,
  password: DB_PASSWORD,
  host: 'localhost',
  database: 'tfc_survival_development',
});

// const limit = 10;
const limit = 1;
const countUsers = 2371;

// for (let offset = 0; offset < countUsers; offset += limit) {
for (let offset = 0; offset < 1; offset += limit) {
  sourceConnect.query(
    'SELECT * FROM Users ORDER BY Id LIMIT ? OFFSET ? ;',
    [limit, offset],
    function(err, results, fields) {
      if (err) throw err;
      // console.log(results); 
      
      for (const row of results) {
        targetConnect.query(
          `INSERT INTO users 
          (
            id, nickname, password_hash, email, discord, created_by_ip, activation_link, is_activated
          ) 
          VALUES 
          (
            ? , ? , ? , ? , ? , ? , ? , ? 
          );`,
          [row.Id, row.Login, bcrypt.hashSync(row.Password, 6), row.Email, row.Discord, row.Ip, uuid.v4(), row.IsEmailConfirmed], 
          function (err) {
          if (err) throw err;
          }
        )
      }
    }
  );
}
