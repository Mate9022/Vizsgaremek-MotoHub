const express = require('express');
const db = require('./database/database');

const customerRoutes = require('./routes/customerRoutes');

const app = express();

app.use(express.json());

const PORT = 3000;

app.get('/api', (req, res) => {
    res.json({
        message: 'MotoHub API működik!'
    });
});

app.use('/api/customers', customerRoutes);

app.listen(PORT, () => {
    console.log(`MotoHub backend elindult a ${PORT} porton.`);
});