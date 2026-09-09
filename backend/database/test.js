const db = require('./database');

const insertCustomer = db.prepare(`
    INSERT INTO customers (name, phone, email)
    VALUES (?, ?, ?)
`);

const result = insertCustomer.run(
    'Kovács Péter',
    '06301234567',
    'peter@example.com'
);

console.log('Létrehozott ügyfél ID:', result.lastInsertRowid);

const customers = db
    .prepare('SELECT * FROM customers')
    .all();

console.log('Ügyfelek:');
console.log(customers);

db.close();