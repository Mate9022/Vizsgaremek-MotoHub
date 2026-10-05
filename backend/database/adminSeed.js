const bcrypt = require('bcryptjs');
const db = require('./database');
require('../config/auth');

async function createAdmin() {
    try {
        const existingAdmin = db
            .prepare('SELECT id FROM admins LIMIT 1')
            .get();

        if (existingAdmin) {
            console.log('Már létezik adminfiók; a seed nem módosított rajta.');
            return;
        }

        const username = process.env.ADMIN_USERNAME?.trim();
        const password = process.env.ADMIN_PASSWORD;

        if (!username || username.length > 64) {
            throw new Error('Állíts be legfeljebb 64 karakteres ADMIN_USERNAME értéket a backend/.env fájlban.');
        }

        if (
            typeof password !== 'string' ||
            password.length < 12 ||
            Buffer.byteLength(password, 'utf8') > 72
        ) {
            throw new Error('Az ADMIN_PASSWORD legyen legalább 12 karakter, és legfeljebb 72 bájt a backend/.env fájlban.');
        }

        const passwordHash = await bcrypt.hash(password, 12);

        db.prepare(`
            INSERT INTO admins (
                username,
                password_hash
            )
            VALUES (?, ?)
        `).run(username, passwordHash);

        console.log('Adminfiók létrehozva a backend/.env beállításai alapján.');
    } catch (error) {
        console.error(`Az admin seed sikertelen: ${error.message}`);
        process.exitCode = 1;
    } finally {
        if (db.open) {
            db.close();
        }
    }
}

createAdmin();
