// routes/proveedor.js
const express = require('express');
const router = express.Router();

const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const proveedorController = require('../controllers/proveedorController');
const servicioController = require('../controllers/servicioController');
const acuerdoController = require('../controllers/acuerdoController');
const resenaController = require('../controllers/resenaController');

// Todas las rutas de /proveedor requieren login + rol proveedor
router.use(requireAuth, requireRole('proveedor'));

// Dashboard (la vista que ya tienes como listado bonito)
router.get('/dashboard', proveedorController.dashboard);

// Perfil del proveedor
router.get('/perfil', proveedorController.mostrarPerfil);
router.post('/perfil', proveedorController.actualizarPerfil);

// CRUD de servicios
router.get('/servicios', servicioController.listarPropios);
router.get('/servicios/nuevo', servicioController.mostrarFormularioNuevo);
router.post('/servicios', servicioController.crear);
router.get('/servicios/:id/editar', servicioController.mostrarFormularioEditar);
router.post('/servicios/:id/editar', servicioController.actualizar);
router.post('/servicios/:id/eliminar', servicioController.eliminar);

// Acuerdos / trueques del proveedor
router.get('/acuerdos', acuerdoController.listarParaProveedor);

// Reseñas del proveedor
router.get('/resenas', resenaController.listarParaProveedor);

module.exports = router;
