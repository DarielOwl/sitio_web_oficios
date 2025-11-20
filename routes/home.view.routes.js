// routes/home.view.routes.js

const express = require('express');
const router = express.Router();

const homeViewController = require('../controllers/home.view.controller');

router.get('/', homeViewController.showHome);

module.exports = router;
