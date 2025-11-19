// routes/service.routes.js

const express = require('express');
const router = express.Router();

const serviceController = require('../controllers/service.controller');

// GET /services → listar todos (con ?providerId= opcional)
router.get('/', serviceController.getAllServices);

// GET /services/:id → obtener uno por id
router.get('/:id', serviceController.getServiceById);

// POST /services → crear servicio
router.post('/', serviceController.createService);

// PUT /services/:id → actualizar servicio
router.put('/:id', serviceController.updateService);

// DELETE /services/:id → eliminar servicio
router.delete('/:id', serviceController.deleteService);

module.exports = router;
