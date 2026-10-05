const workOrderService = require('../services/workOrderService');
const motorcycleService = require('../services/motorcycleService');
const { isRecord, requiredText, positiveInteger } = require('../utils/validation');

const validStatuses = [
    'OPEN',
    'IN_PROGRESS',
    'WAITING_PARTS',
    'READY_FOR_PICKUP',
    'COMPLETED'
];

function parseId(value) {
    const id = Number(value);
    return positiveInteger(id) ? id : null;
}

function getAllWorkOrders(req, res) {
    const workOrders = workOrderService.getAllWorkOrders();

    res.json(workOrders);
}

function getWorkOrderById(req, res) {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: 'Érvénytelen munkalapazonosító.' });

    const workOrder = workOrderService.getWorkOrderById(id);

    if (!workOrder) {
        return res.status(404).json({
            message: 'Munkalap nem található.'
        });
    }

    res.json(workOrder);
}

function createWorkOrder(req, res) {
    const {
        motorcycleId,
        status,
        description
    } = req.body ?? {};

    if (!isRecord(req.body) || !positiveInteger(Number(motorcycleId)) || !requiredText(description)) {
        return res.status(400).json({ message: 'Érvényes motor és leírás megadása kötelező.' });
    }

    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({
            message: 'Érvénytelen munkalap státusz.'
        });
    }

    const normalizedMotorcycleId = Number(motorcycleId);
    const motorcycle = motorcycleService.getMotorcycleById(normalizedMotorcycleId);
    if (!motorcycle) return res.status(404).json({ message: 'Motor nem található.' });

    const workOrder = workOrderService.createWorkOrder(
        normalizedMotorcycleId,
        status || 'OPEN',
        description.trim()
    );

    res.status(201).json(workOrder);
}

function updateWorkOrder(req, res) {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: 'Érvénytelen munkalapazonosító.' });

    const {
        motorcycleId,
        status,
        description
    } = req.body ?? {};

    if (!isRecord(req.body) || !positiveInteger(Number(motorcycleId)) || !requiredText(description) || !status) {
        return res.status(400).json({
            message: 'A motor, a státusz és a leírás megadása kötelező.'
        });
    }

    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            message: 'Érvénytelen munkalap státusz.'
        });
    }

    const normalizedMotorcycleId = Number(motorcycleId);
    const motorcycle = motorcycleService.getMotorcycleById(normalizedMotorcycleId);
    if (!motorcycle) return res.status(404).json({ message: 'Motor nem található.' });

    const workOrder = workOrderService.updateWorkOrder(
        id,
        normalizedMotorcycleId,
        status,
        description.trim()
    );

    if (!workOrder) {
        return res.status(404).json({
            message: 'Munkalap nem található.'
        });
    }

    res.json(workOrder);
}

function deleteWorkOrder(req, res) {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: 'Érvénytelen munkalapazonosító.' });

    const deleted = workOrderService.deleteWorkOrder(id);

    if (!deleted) {
        return res.status(404).json({
            message: 'Munkalap nem található.'
        });
    }

    res.status(204).send();
}

module.exports = {
    getAllWorkOrders,
    getWorkOrderById,
    createWorkOrder,
    updateWorkOrder,
    deleteWorkOrder
};
