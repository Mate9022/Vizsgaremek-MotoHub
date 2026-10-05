const motorcycleService = require('../services/motorcycleService');
const customerService = require('../services/customerService');
const { isRecord, requiredText, optionalText, positiveInteger } = require('../utils/validation');

function parseId(value) {
    const id = Number(value);
    return positiveInteger(id) ? id : null;
}

function validateMotorcycle(body) {
    if (!isRecord(body)) return 'A kérést érvényes adatokkal kell elküldeni.';
    const customerId = Number(body.customerId);
    if (!positiveInteger(customerId) || !requiredText(body.brand, 80) || !requiredText(body.model, 100)) {
        return 'Érvényes ügyfél, márka és modell megadása kötelező.';
    }
    if (!optionalText(body.licensePlate, 20) || !optionalText(body.vin, 40)) {
        return 'A rendszám vagy alvázszám túl hosszú.';
    }
    if (body.modelYear !== undefined && body.modelYear !== null && body.modelYear !== '') {
        const year = Number(body.modelYear);
        if (!Number.isInteger(year) || year < 1885 || year > new Date().getFullYear() + 1) {
            return 'A gyártási év érvénytelen.';
        }
    }
    return null;
}

function getAllMotorcycles(req, res) {
    const motorcycles = motorcycleService.getAllMotorcycles();

    res.json(motorcycles);
}

function getMotorcycleById(req, res) {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: 'Érvénytelen motorazonosító.' });

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
    } = req.body ?? {};

    const validationError = validateMotorcycle(req.body);
    if (validationError) return res.status(400).json({ message: validationError });
    const normalizedCustomerId = Number(customerId);
    const normalizedYear = modelYear === undefined || modelYear === null || modelYear === ''
        ? null
        : Number(modelYear);

    const customer = customerService.getCustomerById(normalizedCustomerId);
    if (!customer) {
        return res.status(404).json({ message: 'Ügyfél nem található.' });
    }

    const motorcycle = motorcycleService.createMotorcycle(
        normalizedCustomerId,
        brand.trim(),
        model.trim(),
        normalizedYear,
        typeof licensePlate === 'string' ? licensePlate.trim() : null,
        typeof vin === 'string' ? vin.trim() : null
    );

    res.status(201).json(motorcycle);
}

function updateMotorcycle(req, res) {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: 'Érvénytelen motorazonosító.' });

    const {
        customerId,
        brand,
        model,
        modelYear,
        licensePlate,
        vin
    } = req.body ?? {};

    const validationError = validateMotorcycle(req.body);
    if (validationError) return res.status(400).json({ message: validationError });
    const normalizedCustomerId = Number(customerId);
    const normalizedYear = modelYear === undefined || modelYear === null || modelYear === ''
        ? null
        : Number(modelYear);

    const customer = customerService.getCustomerById(normalizedCustomerId);
    if (!customer) {
        return res.status(404).json({ message: 'Ügyfél nem található.' });
    }

    const motorcycle = motorcycleService.updateMotorcycle(
        id,
        normalizedCustomerId,
        brand.trim(),
        model.trim(),
        normalizedYear,
        typeof licensePlate === 'string' ? licensePlate.trim() : null,
        typeof vin === 'string' ? vin.trim() : null
    );

    if (!motorcycle) {
        return res.status(404).json({
            message: 'Motor nem található.'
        });
    }

    res.json(motorcycle);
}

function deleteMotorcycle(req, res) {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: 'Érvénytelen motorazonosító.' });

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
