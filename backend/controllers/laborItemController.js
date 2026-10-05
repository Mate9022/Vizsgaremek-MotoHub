const laborItemService = require('../services/laborItemService');
const workOrderService = require('../services/workOrderService');
const { isRecord, requiredText, positiveInteger, positiveNumber } = require('../utils/validation');

function parseId(value) {
    const id = Number(value);
    return positiveInteger(id) ? id : null;
}

function validateBody(body) {
    if (!isRecord(body) || !positiveInteger(Number(body.workOrderId)) || !requiredText(body.description)) {
        return 'Érvényes munkalap és munkaleírás megadása kötelező.';
    }
    if (!positiveNumber(body.hours) || !positiveNumber(body.hourlyRate)) {
        return 'Az óraszámnak és az óradíjnak pozitív, véges számnak kell lennie.';
    }
    return null;
}

function getAllLaborItems(req, res) {
    res.json(laborItemService.getAllLaborItems());
}

function getLaborItemsByWorkOrder(req, res) {
    const workOrderId = parseId(req.params.workOrderId);
    if (!workOrderId) return res.status(400).json({ message: 'Érvénytelen munkalapazonosító.' });
    if (!workOrderService.getWorkOrderById(workOrderId)) {
        return res.status(404).json({ message: 'Munkalap nem található.' });
    }
    res.json(laborItemService.getLaborItemsByWorkOrder(workOrderId));
}

function createLaborItem(req, res) {
    const error = validateBody(req.body);
    if (error) return res.status(400).json({ message: error });
    const { workOrderId, description, hours, hourlyRate } = req.body;
    const normalizedWorkOrderId = Number(workOrderId);
    if (!workOrderService.getWorkOrderById(normalizedWorkOrderId)) {
        return res.status(404).json({ message: 'Munkalap nem található.' });
    }
    const item = laborItemService.createLaborItem(normalizedWorkOrderId, description.trim(), hours, hourlyRate);
    res.status(201).json(item);
}

function getLaborItemById(req, res) {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: 'Érvénytelen munkadíjtétel-azonosító.' });
    const item = laborItemService.getLaborItemById(id);
    if (!item) return res.status(404).json({ message: 'Munkadíjtétel nem található.' });
    res.json(item);
}

function updateLaborItem(req, res) {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: 'Érvénytelen munkadíjtétel-azonosító.' });
    const error = validateBody(req.body);
    if (error) return res.status(400).json({ message: error });
    const { workOrderId, description, hours, hourlyRate } = req.body;
    const normalizedWorkOrderId = Number(workOrderId);
    if (!workOrderService.getWorkOrderById(normalizedWorkOrderId)) {
        return res.status(404).json({ message: 'Munkalap nem található.' });
    }
    const item = laborItemService.updateLaborItem(id, normalizedWorkOrderId, description.trim(), hours, hourlyRate);
    if (!item) return res.status(404).json({ message: 'Munkadíjtétel nem található.' });
    res.json(item);
}

function deleteLaborItem(req, res) {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: 'Érvénytelen munkadíjtétel-azonosító.' });
    if (!laborItemService.deleteLaborItem(id)) {
        return res.status(404).json({ message: 'Munkadíjtétel nem található.' });
    }
    res.status(204).send();
}

module.exports = { getAllLaborItems, getLaborItemsByWorkOrder, createLaborItem, getLaborItemById, updateLaborItem, deleteLaborItem };
