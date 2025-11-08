// routes/proveedor.js
const express = require('express');
const router = express.Router();

const proveedorController = require('../controllers/proveedorController');
const servicioController = require('../controllers/servicioController');
const acuerdoController = require('../controllers/acuerdoController');
const resenaController = require('../controllers/resenaController');

const {
  requireAuth,
  requireRole,
} = require('../middlewares/authMiddleware');

// Todo lo que cuelga de /proveedor requiere estar logueado como proveedor
router.use(requireAuth, requireRole('proveedor'));

router.get('/dashboard', proveedorController.dashboard);
router.get('/servicios', servicioController.listarPropios);
router.get('/acuerdos', acuerdoController.listarParaProveedor);
router.get('/resenas', resenaController.listarParaProveedor);

module.exports = router;
