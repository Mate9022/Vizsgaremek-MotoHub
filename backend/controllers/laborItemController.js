const laborItemService = require('../services/laborItemService');
const workOrderService = require('../services/workOrderService');

function getAllLaborItems(req, res) {
    const laborItems = laborItemService.getAllLaborItems();

    res.json(laborItems);
}

function createLaborItem(req, res) {
    const {
        workOrderId,
        description,
        hours,
        hourlyRate
    } = req.body;

    if (!workOrderId || !description || hours === undefined || hourlyRate === undefined) {
    return res.status(400).json({
        message: 'A munkalap, a leírás, a munkaóra és az óradíj megadása kötelező.'
    });
}

const workOrder = workOrderService.getWorkOrderById(workOrderId);

if (!workOrder) {
    return res.status(404).json({
        message: 'Munkalap nem található.'
    });
}

if (typeof hours !== 'number' || hours <= 0) {
    return res.status(400).json({
        message: 'A munkaórának pozitív számnak kell lennie.'
    });
}

if (typeof hourlyRate !== 'number' || hourlyRate <= 0) {
    return res.status(400).json({
        message: 'Az óradíjnak pozitív számnak kell lennie.'
    });
}

const laborItem = laborItemService.createLaborItem(
    workOrderId,
    description,
    hours,
    hourlyRate
);

    res.status(201).json(laborItem);
}

function getLaborItemById(req, res) {
    const id = Number(req.params.id);

    const laborItem = laborItemService.getLaborItemById(id);

    if (!laborItem) {
        return res.status(404).json({
            message: 'Munkadíj tétel nem található.'
        });
    }

    res.json(laborItem);
}

function updateLaborItem(req, res) {
    const id = Number(req.params.id);

    const {
        workOrderId,
        description,
        hours,
        hourlyRate
    } = req.body;

    if (!workOrderId || !description || hours === undefined || hourlyRate === undefined) {
        return res.status(400).json({
            message: 'A munkalap, a leírás, a munkaóra és az óradíj megadása kötelező.'
        });
    }

    const workOrder = workOrderService.getWorkOrderById(workOrderId);

if (!workOrder) {
    return res.status(404).json({
        message: 'Munkalap nem található.'
    });
}

if (typeof hours !== 'number' || hours <= 0) {
    return res.status(400).json({
        message: 'A munkaórának pozitív számnak kell lennie.'
    });
}

if (typeof hourlyRate !== 'number' || hourlyRate <= 0) {
    return res.status(400).json({
        message: 'Az óradíjnak pozitív számnak kell lennie.'
    });
}

    const laborItem = laborItemService.updateLaborItem(
        id,
        workOrderId,
        description,
        hours,
        hourlyRate
    );

    if (!laborItem) {
        return res.status(404).json({
            message: 'Munkadíj tétel nem található.'
        });
    }

    res.json(laborItem);
}

function deleteLaborItem(req, res) {
    const id = Number(req.params.id);

    const deleted = laborItemService.deleteLaborItem(id);

    if (!deleted) {
        return res.status(404).json({
            message: 'Munkadíj tétel nem található.'
        });
    }

    res.status(204).send();
}

module.exports = {
    getAllLaborItems,
    createLaborItem,
    getLaborItemById,
    updateLaborItem,
    deleteLaborItem
};