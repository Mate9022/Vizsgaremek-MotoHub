const express = require('express');
const cors = require('cors');
const db = require('./database/database');

const customerRoutes = require('./routes/customerRoutes');
const motorcycleRoutes = require('./routes/motorcycleRoutes');
const workOrderRoutes = require('./routes/workOrderRoutes');
const laborItemRoutes = require('./routes/laborItemRoutes');
const partItemRoutes = require('./routes/partItemRoutes');

const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get('/api', (req, res) => {
    res.json({
        message: 'MotoHub API működik!'
    });
});

// Bejelentkezés - nincs szükség tokenre
app.use('/api/auth', authRoutes);

// Admin API-k - JWT szükséges
app.use(
    '/api/customers',
    authMiddleware,
    customerRoutes
);

app.use(
    '/api/motorcycles',
    authMiddleware,
    motorcycleRoutes
);

app.use(
    '/api/work-orders',
    authMiddleware,
    workOrderRoutes
);

app.use(
    '/api/labor-items',
    authMiddleware,
    laborItemRoutes
);

app.use(
    '/api/part-items',
    authMiddleware,
    partItemRoutes
);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`MotoHub backend elindult a ${PORT} porton.`);
});
