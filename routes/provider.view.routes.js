// routes/provider.view.routes.js

const express = require('express');
const router = express.Router();

const providerViewController = require('../controllers/provider.view.controller');

// Formularios y acciones de acuerdos
router.get('/:id/acuerdos/nuevo', providerViewController.showNewAgreementForm);
router.post('/:id/acuerdos', providerViewController.createAgreementFromView);
router.post(
  '/:id/acuerdos/:agreementId/cumplir',
  providerViewController.markAgreementAsCompleted
);

// Formularios y acciones de reseñas ligadas a acuerdos
router.get(
  '/:id/acuerdos/:agreementId/resenas/nueva',
  providerViewController.showNewReviewForm
);
router.post(
  '/:id/acuerdos/:agreementId/resenas',
  providerViewController.createReviewFromView
);

// Vista: lista de proveedores (HTML)
router.get('/', providerViewController.showProvidersList);

// Vista: detalle de proveedor (HTML)
router.get('/:id', providerViewController.showProviderDetail);

module.exports = router;
