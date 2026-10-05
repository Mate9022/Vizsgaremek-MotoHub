const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth');

function authMiddleware(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'Nincs bejelentkezve.'
        });
    }

    const bearerMatch = authHeader.match(/^Bearer\s+(\S+)$/i);

    if (!bearerMatch) {
        return res.status(401).json({
            message: 'Érvénytelen hitelesítési fejléc.'
        });
    }

    const token = bearerMatch[1];

    try {

        const decoded = jwt.verify(
            token,
            jwtSecret,
            { algorithms: ['HS256'] }
        );

        req.admin = decoded;

        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                code: 'TOKEN_EXPIRED',
                message: 'A munkamenet lejárt. Jelentkezz be újra.'
            });
        }

        return res.status(401).json({
            code: 'INVALID_TOKEN',
            message: 'Érvénytelen vagy lejárt token.'
        });

    }
}

module.exports = authMiddleware;
