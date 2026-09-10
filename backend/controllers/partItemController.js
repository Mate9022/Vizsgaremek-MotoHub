const partItemService = require('../services/partItemService');
const workOrderService = require('../services/workOrderService');

function getAllPartItems(req, res) {
    const partItems = partItemService.getAllPartItems();

    res.json(partItems);
}

function getPartItemsByWorkOrder(req, res) {

    const workOrderId = Number(req.params.workOrderId);

    const workOrder = workOrderService.getWorkOrderById(workOrderId);

    if (!workOrder) {
        return res.status(404).json({
            message: 'Munkalap nem található.'
        });
    }

    const partItems = partItemService.getPartItemsByWorkOrder(workOrderId);

    res.json(partItems);
}

function createPartItem(req, res) {
    const {
        workOrderId,
        name,
        quantity,
        unitPrice
    } = req.body;

    if (
        !workOrderId ||
        !name ||
        quantity === undefined ||
        unitPrice === undefined
    ) {
        return res.status(400).json({
            message: 'A munkalap, az alkatrész neve, a mennyiség és az egységár megadása kötelező.'
        });
    }

    const workOrder = workOrderService.getWorkOrderById(workOrderId);

    if (!workOrder) {
        return res.status(404).json({
            message: 'Munkalap nem található.'
        });
    }

    if (typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({
            message: 'A mennyiségnek pozitív számnak kell lennie.'
        });
    }

    if (typeof unitPrice !== 'number' || unitPrice <= 0) {
        return res.status(400).json({
            message: 'Az egységárnak pozitív számnak kell lennie.'
        });
    }

    const partItem = partItemService.createPartItem(
        workOrderId,
        name,
        quantity,
        unitPrice
    );

    res.status(201).json(partItem);
}

function getPartItemById(req, res) {
    const id = Number(req.params.id);

    const partItem = partItemService.getPartItemById(id);

    if (!partItem) {
        return res.status(404).json({
            message: 'Alkatrésztétel nem található.'
        });
    }

    res.json(partItem);
}

function updatePartItem(req, res) {
    const id = Number(req.params.id);

    const {
        workOrderId,
        name,
        quantity,
        unitPrice
    } = req.body;

    if (
        !workOrderId ||
        !name ||
        quantity === undefined ||
        unitPrice === undefined
    ) {
        return res.status(400).json({
            message: 'A munkalap, az alkatrész neve, a mennyiség és az egységár megadása kötelező.'
        });
    }

    const workOrder = workOrderService.getWorkOrderById(workOrderId);

    if (!workOrder) {
        return res.status(404).json({
            message: 'Munkalap nem található.'
        });
    }

    if (typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({
            message: 'A mennyiségnek pozitív számnak kell lennie.'
        });
    }

    if (typeof unitPrice !== 'number' || unitPrice <= 0) {
        return res.status(400).json({
            message: 'Az egységárnak pozitív számnak kell lennie.'
        });
    }

    const partItem = partItemService.updatePartItem(
        id,
        workOrderId,
        name,
        quantity,
        unitPrice
    );

    if (!partItem) {
        return res.status(404).json({
            message: 'Alkatrésztétel nem található.'
        });
    }

    res.json(partItem);
}

function deletePartItem(req, res) {
    const id = Number(req.params.id);

    const deleted = partItemService.deletePartItem(id);

    if (!deleted) {
        return res.status(404).json({
            message: 'Alkatrésztétel nem található.'
        });
    }

    res.status(204).send();
}

module.exports = {
    getAllPartItems,
    createPartItem,
    getPartItemById,
    updatePartItem,
    deletePartItem,
    getPartItemsByWorkOrder
};