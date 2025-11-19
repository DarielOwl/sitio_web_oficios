// routes/agreement.routes.js

const express = require('express');
const router = express.Router();

const agreementController = require('../controllers/agreement.controller');

// GET /agreements → listar
router.get('/', agreementController.getAllAgreements);

// GET /agreements/:id → obtener uno
router.get('/:id', agreementController.getAgreementById);

// POST /agreements → crear
router.post('/', agreementController.createAgreement);

// PUT /agreements/:id → actualizar completo
router.put('/:id', agreementController.updateAgreement);

// PATCH /agreements/:id/status → cambiar solo estado
router.patch('/:id/status', agreementController.updateAgreementStatus);

// DELETE /agreements/:id → eliminar
router.delete('/:id', agreementController.deleteAgreement);

module.exports = router;
