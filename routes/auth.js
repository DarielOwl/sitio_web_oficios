// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.mostrarLogin);
router.post('/login', authController.login);

router.get('/register', authController.mostrarRegistro);
router.post('/register', authController.registro);

router.get('/logout', authController.logout);


module.exports = router;
