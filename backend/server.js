const express = require('express');
const db = require('./database/database');

const app = express();

const PORT = 3000;

app.get('/api', (req, res) => {
    res.json({
        message: 'MotoHub API működik!'
    });
});

app.listen(PORT, () => {
    console.log(`MotoHub backend elindult a ${PORT} porton.`);
});