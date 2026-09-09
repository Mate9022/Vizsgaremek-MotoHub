const motorcycleService = require('../services/motorcycleService');
const customerService = require('../services/customerService');

function getAllMotorcycles(req, res) {
    const motorcycles = motorcycleService.getAllMotorcycles();

    res.json(motorcycles);
}

function getMotorcycleById(req, res) {
    const id = Number(req.params.id);

    const motorcycle = motorcycleService.getMotorcycleById(id);

    if (!motorcycle) {
        return res.status(404).json({
            message: 'Motor nem található.'
        });
    }

    res.json(motorcycle);
}

function createMotorcycle(req, res) {
    const {
        customerId,
        brand,
        model,
        modelYear,
        licensePlate,
        vin
    } = req.body;

    if (!customerId || !brand || !model) {
        return res.status(400).json({
            message: 'Az ügyfél, a márka és a modell megadása kötelező.'
        });
    }

    const customer = customerService.getCustomerById(customerId);

if (!customer) {
    return res.status(404).json({
        message: 'Ügyfél nem található.'
    });
}

    const motorcycle = motorcycleService.createMotorcycle(
        customerId,
        brand,
        model,
        modelYear,
        licensePlate,
        vin
    );

    res.status(201).json(motorcycle);
}

function updateMotorcycle(req, res) {
    const id = Number(req.params.id);

    const {
        customerId,
        brand,
        model,
        modelYear,
        licensePlate,
        vin
    } = req.body;

    if (!customerId || !brand || !model) {
        return res.status(400).json({
            message: 'Az ügyfél, a márka és a modell megadása kötelező.'
        });
    }

    const customer = customerService.getCustomerById(customerId);

if (!customer) {
    return res.status(404).json({
        message: 'Ügyfél nem található.'
    });
}

    const motorcycle = motorcycleService.updateMotorcycle(
        id,
        customerId,
        brand,
        model,
        modelYear,
        licensePlate,
        vin
    );

    if (!motorcycle) {
        return res.status(404).json({
            message: 'Motor nem található.'
        });
    }

    res.json(motorcycle);
}

function deleteMotorcycle(req, res) {
    const id = Number(req.params.id);

    const deleted = motorcycleService.deleteMotorcycle(id);

    if (!deleted) {
        return res.status(404).json({
            message: 'Motor nem található.'
        });
    }

    res.status(204).send();
}

module.exports = {
    getAllMotorcycles,
    getMotorcycleById,
    createMotorcycle,
    updateMotorcycle,
    deleteMotorcycle
};