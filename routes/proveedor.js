const express = require('express');
const router = express.Router();

const proveedorController = require('../controllers/proveedorController');
const servicioController = require('../controllers/servicioController');
const acuerdoController = require('../controllers/acuerdoController');
const resenaController = require('../controllers/resenaController');

// Dashboard
router.get('/dashboard', proveedorController.dashboard);

// Perfil
router.get('/perfil/editar', proveedorController.formPerfil);
router.post('/perfil', proveedorController.guardarPerfil);

// Servicios
router.get('/servicios', servicioController.listarPropios);
router.post('/servicios', servicioController.crear);

// Acuerdos
router.get('/acuerdos', acuerdoController.listarParaProveedor);
router.post('/acuerdos/:id/aceptar', acuerdoController.aceptar);

// Reseñas
router.get('/resenas', resenaController.listarParaProveedor);

module.exports = router;
