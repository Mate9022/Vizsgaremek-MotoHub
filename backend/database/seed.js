const db = require('./database');

console.log('Tesztadatok feltöltése...');

db.exec(`
    DELETE FROM work_orders;
    DELETE FROM motorcycles;
    DELETE FROM customers;

    DELETE FROM sqlite_sequence
    WHERE name IN ('customers', 'motorcycles', 'work_orders');
`);

console.log('Régi adatok törölve.');

const insertCustomer = db.prepare(`
    INSERT INTO customers (name, phone, email)
    VALUES (?, ?, ?)
`);

insertCustomer.run(
    'Kovács Péter',
    '06301234567',
    'peter@example.com'
);

insertCustomer.run(
    'Nagy Anna',
    '06309876543',
    'anna@example.com'
);

console.log('Ügyfelek létrehozva.');

const insertMotorcycle = db.prepare(`
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

insertMotorcycle.run(
    1,
    'Yamaha',
    'MT-07',
    2022,
    'ABC-123',
    'JYARM123456789'
);

insertMotorcycle.run(
    2,
    'Honda',
    'CBR600RR',
    2020,
    'XYZ-789',
    'JH2PC123456789'
);

console.log('Motorok létrehozva.');

const insertWorkOrder = db.prepare(`
    INSERT INTO work_orders (
        motorcycle_id,
        status,
        description
    )
    VALUES (?, ?, ?)
`);

insertWorkOrder.run(
    1,
    'OPEN',
    'Olajcsere és általános átvizsgálás'
);

insertWorkOrder.run(
    2,
    'IN_PROGRESS',
    'Fékbetétek ellenőrzése és cseréje'
);

console.log('Munkalapok létrehozva.');

console.log('Tesztadatok feltöltése kész.');

db.close();