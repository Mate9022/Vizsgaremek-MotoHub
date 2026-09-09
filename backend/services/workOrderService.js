const db = require('../database/database');

function getAllWorkOrders() {
    return db
        .prepare('SELECT * FROM work_orders ORDER BY id DESC')
        .all();
}

function getWorkOrderById(id) {
    return db
        .prepare('SELECT * FROM work_orders WHERE id = ?')
        .get(id);
}

function createWorkOrder(
    motorcycleId,
    status,
    description
) {
    const statement = db.prepare(`
        INSERT INTO work_orders (
            motorcycle_id,
            status,
            description
        )
        VALUES (?, ?, ?)
    `);

    const result = statement.run(
        motorcycleId,
        status,
        description
    );

    return getWorkOrderById(result.lastInsertRowid);
}

function updateWorkOrder(
    id,
    motorcycleId,
    status,
    description
) {
    const statement = db.prepare(`
        UPDATE work_orders
        SET
            motorcycle_id = ?,
            status = ?,
            description = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `);

    const result = statement.run(
        motorcycleId,
        status,
        description,
        id
    );

    if (result.changes === 0) {
        return null;
    }

    return getWorkOrderById(id);
}

function deleteWorkOrder(id) {
    const statement = db.prepare(`
        DELETE FROM work_orders
        WHERE id = ?
    `);

    const result = statement.run(id);

    return result.changes > 0;
}

module.exports = {
    getAllWorkOrders,
    getWorkOrderById,
    createWorkOrder,
    updateWorkOrder,
    deleteWorkOrder
};