const db = require('../database/database');

function getAllMotorcycles() {
    return db
        .prepare('SELECT * FROM motorcycles ORDER BY id DESC')
        .all();
}

function getMotorcycleById(id) {
    return db
        .prepare('SELECT * FROM motorcycles WHERE id = ?')
        .get(id);
}

function createMotorcycle(
    customerId,
    brand,
    model,
    modelYear,
    licensePlate,
    vin
) {
    const statement = db.prepare(`
        INSERT INTO motorcycles (
            customer_id,
            brand,
            model,
            model_year,
            license_plate,
            vin
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = statement.run(
        customerId,
        brand,
        model,
        modelYear,
        licensePlate,
        vin
    );

    return getMotorcycleById(result.lastInsertRowid);
}

function updateMotorcycle(
    id,
    customerId,
    brand,
    model,
    modelYear,
    licensePlate,
    vin
) {
    const statement = db.prepare(`
        UPDATE motorcycles
        SET
            customer_id = ?,
            brand = ?,
            model = ?,
            model_year = ?,
            license_plate = ?,
            vin = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `);

    const result = statement.run(
        customerId,
        brand,
        model,
        modelYear,
        licensePlate,
        vin,
        id
    );

    if (result.changes === 0) {
        return null;
    }

    return getMotorcycleById(id);
}

function deleteMotorcycle(id) {
    const statement = db.prepare(`
        DELETE FROM motorcycles
        WHERE id = ?
    `);

    const result = statement.run(id);

    return result.changes > 0;
}

module.exports = {
    getAllMotorcycles,
    getMotorcycleById,
    createMotorcycle,
    updateMotorcycle,
    deleteMotorcycle
};