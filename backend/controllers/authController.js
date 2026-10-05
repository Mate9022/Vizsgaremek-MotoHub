const authService = require('../services/authService');

async function login(req, res) {

    const {
        username,
        password
    } = req.body ?? {};

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

async function changePassword(req, res) {
    const { currentPassword, newPassword } = req.body ?? {};

    if (
        typeof currentPassword !== 'string' ||
        !currentPassword ||
        typeof newPassword !== 'string'
    ) {
        return res.status(400).json({
            message: 'A jelenlegi és az új jelszó megadása kötelező.'
        });
    }

    if (newPassword.length < 12 || Buffer.byteLength(newPassword, 'utf8') > 72) {
        return res.status(400).json({
            message: 'Az új jelszó legalább 12 karakteres és legfeljebb 72 bájtos legyen.'
        });
    }

    if (currentPassword === newPassword) {
        return res.status(400).json({
            message: 'Az új jelszónak különböznie kell a jelenlegitől.'
        });
    }

    try {
        const result = await authService.changePassword(
            req.admin.id,
            currentPassword,
            newPassword
        );

        if (result.status === 'not_found') {
            return res.status(404).json({
                message: 'Az adminfiók nem található.'
            });
        }

        if (result.status === 'invalid_current_password') {
            return res.status(400).json({
                message: 'A jelenlegi jelszó nem megfelelő.'
            });
        }

        return res.json({
            message: 'A jelszó sikeresen megváltozott.'
        });
    } catch (error) {
        console.error('Jelszóváltoztatási hiba:', error);
        return res.status(500).json({
            message: 'Hiba történt a jelszó megváltoztatásakor.'
        });
    }
}

module.exports = {
    login,
    changePassword
};
