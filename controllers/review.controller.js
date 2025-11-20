// controllers/review.controller.js

const reviewService = require('../services/review.service');

// GET /reviews → listar (opcional: ?providerId=&agreementId=)
async function getAllReviews(req, res) {
  try {
    const { providerId, agreementId } = req.query;
    const reviews = await reviewService.getAllReviews({ providerId, agreementId });
    return res.status(200).json(reviews);
  } catch (error) {
    console.error('Error getting reviews:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// GET /reviews/:id → obtener una reseña
async function getReviewById(req, res) {
  try {
    const { id } = req.params;
    const review = await reviewService.getReviewById(id);
    return res.status(200).json(review);
  } catch (error) {
    console.error('Error getting review:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
}

// POST /reviews → crear reseña
async function createReview(req, res) {
  try {
    const reviewData = req.body;
    const newReview = await reviewService.createReview(reviewData);
    return res.status(201).json(newReview);
  } catch (error) {
    console.error('Error creating review:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
}

// PUT /reviews/:id → actualizar reseña
async function updateReview(req, res) {
  try {
    const { id } = req.params;
    const reviewData = req.body;
    const updatedReview = await reviewService.updateReview(id, reviewData);
    return res.status(200).json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
}

// DELETE /reviews/:id → eliminar reseña
async function deleteReview(req, res) {
  try {
    const { id } = req.params;
    await reviewService.deleteReview(id);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting review:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
}

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
};
