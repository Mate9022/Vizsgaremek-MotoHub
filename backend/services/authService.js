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

module.exports = {
    login
};
