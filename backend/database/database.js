const Database = require('better-sqlite3');

const db = new Database('./database/motohub.db');

console.log('SQLite adatbázis csatlakoztatva.');

module.exports = db;