const express = require('express');

const partItemController = require('../controllers/partItemController');

const router = express.Router();

router.get('/', partItemController.getAllPartItems);

router.get(
    '/work-order/:workOrderId',
    partItemController.getPartItemsByWorkOrder
);

router.post('/', partItemController.createPartItem);

router.get('/:id', partItemController.getPartItemById);

router.put('/:id', partItemController.updatePartItem);

router.delete('/:id', partItemController.deletePartItem);

module.exports = router;