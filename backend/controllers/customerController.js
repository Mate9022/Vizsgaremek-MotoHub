const customerService = require('../services/customerService');
const { isRecord, requiredText, optionalText } = require('../utils/validation');

function parseId(value) {
    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function validateCustomer(body) {
    if (!isRecord(body) || !requiredText(body.name, 120)) {
        return 'A név megadása kötelező (legfeljebb 120 karakter).';
    }
    if (!optionalText(body.phone, 40) || !optionalText(body.email, 254)) {
        return 'A telefonszám vagy e-mail-cím túl hosszú, vagy hibás formátumú.';
    }
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Az e-mail-cím formátuma érvénytelen.';
    }
    return null;
}

function getAllCustomers(req, res) {
    const customers = customerService.getAllCustomers();

    res.json(customers);
}

function getCustomerById(req, res) {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: 'Érvénytelen ügyfélazonosító.' });

    const customer = customerService.getCustomerById(id);

    if (!customer) {
        return res.status(404).json({
            message: 'Ügyfél nem található.'
        });
    }

    res.json(customer);
}

function createCustomer(req, res) {
    const validationError = validateCustomer(req.body);
    if (validationError) return res.status(400).json({ message: validationError });
    const { name, phone, email } = req.body;

    const customer = customerService.createCustomer(
        name.trim(),
        typeof phone === 'string' ? phone.trim() : null,
        typeof email === 'string' ? email.trim() : null
    );

    res.status(201).json(customer);
}

function updateCustomer(req, res) {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: 'Érvénytelen ügyfélazonosító.' });
    const validationError = validateCustomer(req.body);
    if (validationError) return res.status(400).json({ message: validationError });
    const { name, phone, email } = req.body;

    const customer = customerService.updateCustomer(
        id,
        name.trim(),
        typeof phone === 'string' ? phone.trim() : null,
        typeof email === 'string' ? email.trim() : null
    );

    if (!customer) {
        return res.status(404).json({
            message: 'Ügyfél nem található.'
        });
    }

    res.json(customer);
}

function deleteCustomer(req, res) {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: 'Érvénytelen ügyfélazonosító.' });

    const deleted = customerService.deleteCustomer(id);

    if (!deleted) {
        return res.status(404).json({
            message: 'Ügyfél nem található.'
        });
    }

    res.status(204).send();
}

module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
};
