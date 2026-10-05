const jwt = require('jsonwebtoken');

const JWT_SECRET = 'motohub-secret-key';

function authMiddleware(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'Nincs bejelentkezve.'
        });
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Érvénytelen hitelesítési fejléc.'
        });
    }

    const token = authHeader.split(' ')[1];

    try {

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        req.admin = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: 'Érvénytelen vagy lejárt token.'
        });

    }
}

module.exports = authMiddleware;