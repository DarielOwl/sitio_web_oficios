// routes/provider.routes.js

const express = require('express');
const router = express.Router();

const providerController = require('../controllers/provider.controller');

// GET /providers → listar todos
router.get('/', providerController.getAllProviders);

// GET /providers/:id → obtener uno por id
router.get('/:id', providerController.getProviderById);

// POST /providers → crear proveedor
router.post('/', providerController.createProvider);

// PUT /providers/:id → actualizar proveedor
router.put('/:id', providerController.updateProvider);

// DELETE /providers/:id → eliminar proveedor
router.delete('/:id', providerController.deleteProvider);

module.exports = router;
