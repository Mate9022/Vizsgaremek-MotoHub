const express = require('express');
const db = require('./database/database');

const customerRoutes = require('./routes/customerRoutes');
const motorcycleRoutes = require('./routes/motorcycleRoutes');
const workOrderRoutes = require('./routes/workOrderRoutes');

const laborItemRoutes = require('./routes/laborItemRoutes');

const app = express();

app.use(express.json());

const PORT = 3000;

app.get('/api', (req, res) => {
    res.json({
        message: 'MotoHub API működik!'
    });
});

app.use('/api/customers', customerRoutes);
app.use('/api/motorcycles', motorcycleRoutes);
app.use('/api/work-orders', workOrderRoutes);

app.use('/api/labor-items', laborItemRoutes);

app.listen(PORT, () => {
    console.log(`MotoHub backend elindult a ${PORT} porton.`);
});