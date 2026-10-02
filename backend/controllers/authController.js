const authService = require('../services/authService');

async function login(req, res) {

    const {
        username,
        password
    } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'A felhasználónév és a jelszó megadása kötelező.'
        });
    }

    const result = await authService.login(
        username,
        password
    );

    if (!result) {
        return res.status(401).json({
            message: 'Hibás felhasználónév vagy jelszó.'
        });
    }

    res.json(result);
}

module.exports = {
    login
};