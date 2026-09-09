const customerService = require('../services/customerService');

function getAllCustomers(req, res) {
    const customers = customerService.getAllCustomers();

    res.json(customers);
}

function getCustomerById(req, res) {
    const id = Number(req.params.id);

    const customer = customerService.getCustomerById(id);

    if (!customer) {
        return res.status(404).json({
            message: 'Ügyfél nem található.'
        });
    }

    res.json(customer);
}

function createCustomer(req, res) {
    const { name, phone, email } = req.body;

    if (!name) {
        return res.status(400).json({
            message: 'A név megadása kötelező.'
        });
    }

    const customer = customerService.createCustomer(
        name,
        phone,
        email
    );

    res.status(201).json(customer);
}

function updateCustomer(req, res) {
    const id = Number(req.params.id);
    const { name, phone, email } = req.body;

    if (!name) {
        return res.status(400).json({
            message: 'A név megadása kötelező.'
        });
    }

    const customer = customerService.updateCustomer(
        id,
        name,
        phone,
        email
    );

    if (!customer) {
        return res.status(404).json({
            message: 'Ügyfél nem található.'
        });
    }

    res.json(customer);
}

function deleteCustomer(req, res) {
    const id = Number(req.params.id);

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