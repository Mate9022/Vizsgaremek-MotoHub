const Database = require('better-sqlite3');

const db = new Database('./database/motohub.db');

db.pragma('foreign_keys = ON');

console.log('SQLite adatbázis csatlakoztatva.');

module.exports = db;