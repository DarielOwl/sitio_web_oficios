// routes/service.view.routes.js

const express = require('express');
const router = express.Router();

const serviceViewController = require('../controllers/service.view.controller');

// Vista: listado de servicios con filtros
router.get('/', serviceViewController.showServicesList);

module.exports = router;
