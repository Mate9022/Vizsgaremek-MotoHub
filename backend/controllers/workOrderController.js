const workOrderService = require('../services/workOrderService');

const validStatuses = [
    'OPEN',
    'IN_PROGRESS',
    'WAITING_PARTS',
    'READY_FOR_PICKUP',
    'COMPLETED'
];

function getAllWorkOrders(req, res) {
    const workOrders = workOrderService.getAllWorkOrders();

    res.json(workOrders);
}

function getWorkOrderById(req, res) {
    const id = Number(req.params.id);

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
    } = req.body;

    if (!motorcycleId || !description) {
        return res.status(400).json({
            message: 'A motor és a leírás megadása kötelező.'
        });
    }

    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({
            message: 'Érvénytelen munkalap státusz.'
        });
    }

    const workOrder = workOrderService.createWorkOrder(
        motorcycleId,
        status || 'OPEN',
        description
    );

    res.status(201).json(workOrder);
}

function updateWorkOrder(req, res) {
    const id = Number(req.params.id);

    const {
        motorcycleId,
        status,
        description
    } = req.body;

    if (!motorcycleId || !description || !status) {
        return res.status(400).json({
            message: 'A motor, a státusz és a leírás megadása kötelező.'
        });
    }

    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            message: 'Érvénytelen munkalap státusz.'
        });
    }

    const workOrder = workOrderService.updateWorkOrder(
        id,
        motorcycleId,
        status,
        description
    );

    if (!workOrder) {
        return res.status(404).json({
            message: 'Munkalap nem található.'
        });
    }

    res.json(workOrder);
}

function deleteWorkOrder(req, res) {
    const id = Number(req.params.id);

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