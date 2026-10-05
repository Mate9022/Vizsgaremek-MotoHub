const partItemService = require('../services/partItemService');
const workOrderService = require('../services/workOrderService');
const { isRecord, requiredText, positiveInteger, positiveNumber } = require('../utils/validation');

function parseId(value) {
    const id = Number(value);
    return positiveInteger(id) ? id : null;
}

function validateBody(body) {
    if (!isRecord(body) || !positiveInteger(Number(body.workOrderId)) || !requiredText(body.name, 160)) {
        return 'Érvényes munkalap és alkatrésznév megadása kötelező.';
    }
    if (!positiveNumber(body.quantity) || !positiveNumber(body.unitPrice)) {
        return 'A mennyiségnek és az egységárnak pozitív, véges számnak kell lennie.';
    }
    return null;
}

function getAllPartItems(req, res) {
    res.json(partItemService.getAllPartItems());
}

function getPartItemsByWorkOrder(req, res) {
    const workOrderId = parseId(req.params.workOrderId);
    if (!workOrderId) return res.status(400).json({ message: 'Érvénytelen munkalapazonosító.' });
    if (!workOrderService.getWorkOrderById(workOrderId)) {
        return res.status(404).json({ message: 'Munkalap nem található.' });
    }
    res.json(partItemService.getPartItemsByWorkOrder(workOrderId));
}

function createPartItem(req, res) {
    const error = validateBody(req.body);
    if (error) return res.status(400).json({ message: error });
    const { workOrderId, name, quantity, unitPrice } = req.body;
    const normalizedWorkOrderId = Number(workOrderId);
    if (!workOrderService.getWorkOrderById(normalizedWorkOrderId)) {
        return res.status(404).json({ message: 'Munkalap nem található.' });
    }
    const item = partItemService.createPartItem(normalizedWorkOrderId, name.trim(), quantity, unitPrice);
    res.status(201).json(item);
}

function getPartItemById(req, res) {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: 'Érvénytelen alkatrésztétel-azonosító.' });
    const item = partItemService.getPartItemById(id);
    if (!item) return res.status(404).json({ message: 'Alkatrésztétel nem található.' });
    res.json(item);
}

function updatePartItem(req, res) {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: 'Érvénytelen alkatrésztétel-azonosító.' });
    const error = validateBody(req.body);
    if (error) return res.status(400).json({ message: error });
    const { workOrderId, name, quantity, unitPrice } = req.body;
    const normalizedWorkOrderId = Number(workOrderId);
    if (!workOrderService.getWorkOrderById(normalizedWorkOrderId)) {
        return res.status(404).json({ message: 'Munkalap nem található.' });
    }
    const item = partItemService.updatePartItem(id, normalizedWorkOrderId, name.trim(), quantity, unitPrice);
    if (!item) return res.status(404).json({ message: 'Alkatrésztétel nem található.' });
    res.json(item);
}

function deletePartItem(req, res) {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: 'Érvénytelen alkatrésztétel-azonosító.' });
    if (!partItemService.deletePartItem(id)) {
        return res.status(404).json({ message: 'Alkatrésztétel nem található.' });
    }
    res.status(204).send();
}

module.exports = { getAllPartItems, getPartItemsByWorkOrder, createPartItem, getPartItemById, updatePartItem, deletePartItem };
