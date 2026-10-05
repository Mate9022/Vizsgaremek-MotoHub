function notFoundHandler(req, res) {
    res.status(404).json({ message: 'A kért végpont nem található.' });
}

function errorHandler(error, req, res, next) {
    if (res.headersSent) {
        return next(error);
    }

    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({ message: 'A kérés törzse hibás JSON formátumú.' });
    }

    if (error.type === 'entity.too.large') {
        return res.status(413).json({ message: 'A kérés túl nagy.' });
    }

    if (typeof error.code === 'string' && error.code.startsWith('SQLITE_CONSTRAINT')) {
        return res.status(400).json({ message: 'A megadott adatok nem menthetők.' });
    }

    console.error('Nem kezelt API-hiba:', error);
    return res.status(500).json({ message: 'Váratlan szerverhiba történt.' });
}

module.exports = { notFoundHandler, errorHandler };
