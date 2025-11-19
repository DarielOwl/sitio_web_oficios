// routes/provider.view.routes.js

const express = require('express');
const router = express.Router();

const providerViewController = require('../controllers/provider.view.controller');

// Vista: formulario para nuevo acuerdo
router.get('/:id/acuerdos/nuevo', providerViewController.showNewAgreementForm);

// Vista: procesar creación de acuerdo
router.post('/:id/acuerdos', providerViewController.createAgreementFromView);

// Vista: lista de proveedores (HTML)
router.get('/', providerViewController.showProvidersList);

// Vista: detalle de proveedor (HTML)
router.get('/:id', providerViewController.showProviderDetail);

module.exports = router;
