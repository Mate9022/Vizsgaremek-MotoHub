const path = require('node:path');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config({
    path: path.resolve(__dirname, '../.env')
});

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN?.trim() || '2h';

if (!jwtSecret || Buffer.byteLength(jwtSecret, 'utf8') < 32) {
    throw new Error(
        'A JWT_SECRET hiányzik vagy túl rövid. Állíts be legalább 32 karakteres titkot a backend/.env fájlban.'
    );
}

try {
    jwt.sign({ configCheck: true }, jwtSecret, { expiresIn: jwtExpiresIn });
} catch {
    throw new Error(
        'A JWT_EXPIRES_IN értéke érvénytelen. Például: 2h vagy 30m.'
    );
}

module.exports = {
    jwtSecret,
    jwtExpiresIn
};
