const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "mughalfrazk'@'localhost",
  password: "Password@1",
  database: "scrapper_live",
});

module.exports = db;
