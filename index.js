const http = require("http");
require('dotenv').config();

const mysql = require("mysql2/promise");

function openConnection() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });
}

function createTable(connection) {
  return connection.execute(
    `CREATE TABLE IF NOT EXISTS platforminfo (
      uid INT(10) NOT NULL AUTO_INCREMENT,
      username VARCHAR(64) NULL DEFAULT NULL,
      departname VARCHAR(128) NULL DEFAULT NULL,
      created DATE NULL DEFAULT NULL,
      PRIMARY KEY (uid)
    ) DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;`
  );
}

function insertData(connection) {
  return connection.execute(
    "INSERT INTO platforminfo (username, departname, created) VALUES ('platform', 'Deploy Friday', '2021-12-03')"
  );
}

function readData(connection) {
  return connection.query("SELECT * FROM platforminfo");
}

function dropTable(connection) {
  return connection.execute("DROP TABLE platforminfo");
}

const server = http.createServer(async function(_request, response) {
  // Connect to MariaDB.
  const connection = await openConnection();

  // await createTable(connection);
  await insertData(connection);

  const [rows] = await readData(connection); 

  // const droppedResult = await dropTable(connection);

  // Make the output.
  const outputString = `Hello, World updated again and again!!!! - A simple Node.js template for Shapeblock.com.
MariaDB Tests:
* Connect and add row:
  - Row ID (1): ${rows[0].uid}
  - Username (platform): ${rows[0].username}
  - Department (Deploy Friday): ${rows[0].departname}
  - Created (2021-08-04): ${rows[0].created}`;

  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end(outputString);
});

// Get PORT and start the server
server.listen(process.env.PORT, function() {
  console.log(`Listening on port ${process.env.PORT}`);
});