const bcrypt = require('bcryptjs');
const db = require('./database');

async function createAdmin() {
    const username = 'admin';
    const password = 'admin123';

    const existingAdmin = db
        .prepare('SELECT id FROM admins WHERE username = ?')
        .get(username);

    if (existingAdmin) {
        console.log('Az admin felhasználó már létezik.');
        db.close();
        return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    db.prepare(`
        INSERT INTO admins (
            username,
            password_hash
        )
        VALUES (?, ?)
    `).run(
        username,
        passwordHash
    );

    console.log('Admin felhasználó létrehozva.');
    console.log(`Felhasználónév: ${username}`);
    console.log(`Jelszó: ${password}`);

    db.close();
}

createAdmin();