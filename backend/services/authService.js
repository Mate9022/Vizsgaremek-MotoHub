const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../database/database');
const { jwtSecret, jwtExpiresIn } = require('../config/auth');

async function login(username, password) {

    const admin = db
        .prepare(`
            SELECT *
            FROM admins
            WHERE username = ?
        `)
        .get(username);

    if (!admin) {
        return null;
    }

    const passwordMatches = await bcrypt.compare(
        password,
        admin.password_hash
    );

    if (!passwordMatches) {
        return null;
    }

    const token = jwt.sign(
        {
            id: admin.id,
            username: admin.username
        },
        jwtSecret,
        {
            expiresIn: jwtExpiresIn,
            algorithm: 'HS256'
        }
    );

    return {
        token,
        admin: {
            id: admin.id,
            username: admin.username
        }
    };
}

async function changePassword(adminId, currentPassword, newPassword) {
    const admin = db
        .prepare(`
            SELECT id, password_hash
            FROM admins
            WHERE id = ?
        `)
        .get(adminId);

    if (!admin) {
        return { status: 'not_found' };
    }

    const passwordMatches = await bcrypt.compare(
        currentPassword,
        admin.password_hash
    );

    if (!passwordMatches) {
        return { status: 'invalid_current_password' };
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    const result = db
        .prepare('UPDATE admins SET password_hash = ? WHERE id = ?')
        .run(passwordHash, adminId);

    return { status: result.changes === 1 ? 'updated' : 'not_found' };
}

module.exports = {
    login,
    changePassword
};
