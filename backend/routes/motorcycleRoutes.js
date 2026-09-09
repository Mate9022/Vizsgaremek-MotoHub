const express = require('express');

const motorcycleController = require('../controllers/motorcycleController');

const router = express.Router();

router.get('/', motorcycleController.getAllMotorcycles);
router.get('/:id', motorcycleController.getMotorcycleById);
router.post('/', motorcycleController.createMotorcycle);
router.put('/:id', motorcycleController.updateMotorcycle);
router.delete('/:id', motorcycleController.deleteMotorcycle);

module.exports = router;