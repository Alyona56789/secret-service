const Database = require('better-sqlite3');

const db = new Database('secret.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS secrets (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('База данных подключена и готова');

module.exports = db;