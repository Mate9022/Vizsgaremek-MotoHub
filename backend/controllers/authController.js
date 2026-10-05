const authService = require('../services/authService');

async function login(req, res) {

    const {
        username,
        password
    } = req.body;

    if (
        typeof username !== 'string' ||
        !username.trim() ||
        typeof password !== 'string' ||
        !password
    ) {
        return res.status(400).json({
            message: 'A felhasználónév és a jelszó megadása kötelező.'
        });
    }

    try {
        const result = await authService.login(
            username.trim(),
            password
        );

        if (!result) {
            return res.status(401).json({
                message: 'Hibás felhasználónév vagy jelszó.'
            });
        }

        return res.json(result);
    } catch (error) {
        console.error('Bejelentkezési hiba:', error);
        return res.status(500).json({
            message: 'Hiba történt a bejelentkezés során.'
        });
    }
}

module.exports = {
    login
};
