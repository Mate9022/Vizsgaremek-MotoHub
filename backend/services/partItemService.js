const db = require('../database/database');

function getAllPartItems() {
    return db
        .prepare('SELECT * FROM part_items ORDER BY id DESC')
        .all();
}

function getPartItemById(id) {
    return db
        .prepare('SELECT * FROM part_items WHERE id = ?')
        .get(id);
}

function createPartItem(
    workOrderId,
    name,
    quantity,
    unitPrice
) {
    const statement = db.prepare(`
        INSERT INTO part_items (
            work_order_id,
            name,
            quantity,
            unit_price
        )
        VALUES (?, ?, ?, ?)
    `);

    const result = statement.run(
        workOrderId,
        name,
        quantity,
        unitPrice
    );

    return getPartItemById(result.lastInsertRowid);
}

function updatePartItem(
    id,
    workOrderId,
    name,
    quantity,
    unitPrice
) {
    const statement = db.prepare(`
        UPDATE part_items
        SET
            work_order_id = ?,
            name = ?,
            quantity = ?,
            unit_price = ?
        WHERE id = ?
    `);

    const result = statement.run(
        workOrderId,
        name,
        quantity,
        unitPrice,
        id
    );

    if (result.changes === 0) {
        return null;
    }

    return getPartItemById(id);
}

function deletePartItem(id) {
    const statement = db.prepare(`
        DELETE FROM part_items
        WHERE id = ?
    `);

    const result = statement.run(id);

    return result.changes > 0;
}

module.exports = {
    getAllPartItems,
    getPartItemById,
    createPartItem,
    updatePartItem,
    deletePartItem
};