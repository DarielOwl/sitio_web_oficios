const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');

// Rutas
router.get('/', proveedorController.listarProveedores);
router.get('/:id', proveedorController.verPerfil);

module.exports = router;
