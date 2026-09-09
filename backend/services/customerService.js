const db = require('../database/database');

function getAllCustomers() {
    return db
        .prepare('SELECT * FROM customers ORDER BY id DESC')
        .all();
}

function getCustomerById(id) {
    return db
        .prepare('SELECT * FROM customers WHERE id = ?')
        .get(id);
}

function createCustomer(name, phone, email) {
    const statement = db.prepare(`
        INSERT INTO customers (name, phone, email)
        VALUES (?, ?, ?)
    `);

    const result = statement.run(name, phone, email);

    return getCustomerById(result.lastInsertRowid);
}

function updateCustomer(id, name, phone, email) {
    const statement = db.prepare(`
        UPDATE customers
        SET name = ?, phone = ?, email = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `);

    const result = statement.run(name, phone, email, id);

    if (result.changes === 0) {
        return null;
    }

    return getCustomerById(id);
}

function deleteCustomer(id) {
    const statement = db.prepare(`
        DELETE FROM customers
        WHERE id = ?
    `);

    const result = statement.run(id);

    return result.changes > 0;
}

module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
};