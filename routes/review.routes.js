// routes/review.routes.js

const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/review.controller');

// GET /reviews → listar
router.get('/', reviewController.getAllReviews);

// GET /reviews/:id → obtener una
router.get('/:id', reviewController.getReviewById);

// POST /reviews → crear
router.post('/', reviewController.createReview);

// PUT /reviews/:id → actualizar
router.put('/:id', reviewController.updateReview);

// DELETE /reviews/:id → eliminar
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
