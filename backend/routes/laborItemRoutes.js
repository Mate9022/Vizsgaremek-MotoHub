const express = require('express');

const laborItemController = require('../controllers/laborItemController');

const router = express.Router();

router.get('/', laborItemController.getAllLaborItems);
router.post('/', laborItemController.createLaborItem);
router.get('/:id', laborItemController.getLaborItemById);
router.put('/:id', laborItemController.updateLaborItem);
router.delete('/:id', laborItemController.deleteLaborItem);

module.exports = router;