const db = require('./database');

db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS motorcycles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        model_year INTEGER,
        license_plate TEXT,
        vin TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (customer_id) REFERENCES customers(id)
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS work_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        motorcycle_id INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'OPEN',
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (motorcycle_id) REFERENCES motorcycles(id)
    )
`);

console.log('Adatbázis táblák létrehozva.');

db.close();