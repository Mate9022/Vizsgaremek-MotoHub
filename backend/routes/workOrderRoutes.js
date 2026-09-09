const express = require('express');

const workOrderController = require('../controllers/workOrderController');

const router = express.Router();

router.get('/', workOrderController.getAllWorkOrders);
router.get('/:id', workOrderController.getWorkOrderById);
router.post('/', workOrderController.createWorkOrder);
router.put('/:id', workOrderController.updateWorkOrder);
router.delete('/:id', workOrderController.deleteWorkOrder);

module.exports = router;