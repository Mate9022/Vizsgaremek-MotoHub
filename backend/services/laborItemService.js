const db = require('../database/database');

function getAllLaborItems() {
    const laborItems = db
        .prepare('SELECT * FROM labor_items ORDER BY id DESC')
        .all();

    return laborItems.map(laborItem => ({
        ...laborItem,
        total_price: laborItem.hours * laborItem.hourly_rate
    }));
}

function getLaborItemById(id) {
    const laborItem = db
        .prepare('SELECT * FROM labor_items WHERE id = ?')
        .get(id);

    if (!laborItem) {
        return null;
    }

    return {
        ...laborItem,
        total_price: laborItem.hours * laborItem.hourly_rate
    };
}

function createLaborItem(
    workOrderId,
    description,
    hours,
    hourlyRate
) {
    const statement = db.prepare(`
        INSERT INTO labor_items (
            work_order_id,
            description,
            hours,
            hourly_rate
        )
        VALUES (?, ?, ?, ?)
    `);

    const result = statement.run(
        workOrderId,
        description,
        hours,
        hourlyRate
    );

    return getLaborItemById(result.lastInsertRowid);
}

function updateLaborItem(
    id,
    workOrderId,
    description,
    hours,
    hourlyRate
) {
    const statement = db.prepare(`
        UPDATE labor_items
        SET
            work_order_id = ?,
            description = ?,
            hours = ?,
            hourly_rate = ?
        WHERE id = ?
    `);

    const result = statement.run(
        workOrderId,
        description,
        hours,
        hourlyRate,
        id
    );

    if (result.changes === 0) {
        return null;
    }

    return getLaborItemById(id);
}

function deleteLaborItem(id) {
    const statement = db.prepare(`
        DELETE FROM labor_items
        WHERE id = ?
    `);

    const result = statement.run(id);

    return result.changes > 0;
}

module.exports = {
    getAllLaborItems,
    getLaborItemById,
    createLaborItem,
    updateLaborItem,
    deleteLaborItem
};