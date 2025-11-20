// routes/auth.view.routes.js

const express = require('express');
const router = express.Router();

const authViewController = require('../controllers/auth.view.controller');

router.get('/register', authViewController.showRegisterForm);
router.post('/register', authViewController.register);

router.get(
  '/register-client',
  authViewController.showClientRegisterForm
);
router.post(
  '/register-client',
  authViewController.registerClient
);

router.get('/login', authViewController.showLoginForm);
router.post('/login', authViewController.login);

router.post('/logout', authViewController.logout);

module.exports = router;
