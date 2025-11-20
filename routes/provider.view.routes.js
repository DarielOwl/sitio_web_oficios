// routes/provider.view.routes.js

const express = require('express');
const router = express.Router();

const providerViewController = require('../controllers/provider.view.controller');

// ---------- SERVICIOS DESDE VISTA ----------
router.get('/:id/servicios/nuevo', providerViewController.showNewServiceForm);
router.post('/:id/servicios', providerViewController.createServiceFromView);
router.get(
  '/:id/servicios/:serviceId/editar',
  providerViewController.showEditServiceForm
);
router.post(
  '/:id/servicios/:serviceId/editar',
  providerViewController.updateServiceFromView
);
router.post(
  '/:id/servicios/:serviceId/eliminar',
  providerViewController.deleteServiceFromView
);

// ---------- ACUERDOS DESDE VISTA ----------
router.get('/:id/acuerdos/nuevo', providerViewController.showNewAgreementForm);
router.post('/:id/acuerdos', providerViewController.createAgreementFromView);
router.post(
  '/:id/acuerdos/:agreementId/cumplir',
  providerViewController.markAgreementAsCompleted
);

// ---------- RESEÑAS DESDE VISTA ----------
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
