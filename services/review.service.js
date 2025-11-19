// services/review.service.js

const ReviewModel = require('../models/review.model');
const AgreementModel = require('../models/agreement.model');
const ProviderModel = require('../models/provider.model');

// Listar reseñas (opcionalmente filtradas por providerId o agreementId)
async function getAllReviews(filter = {}) {
  const { providerId, agreementId } = filter;

  if (providerId) {
    return ReviewModel.getReviewsByProviderId(providerId);
  }

  if (agreementId) {
    return ReviewModel.getReviewsByAgreementId(agreementId);
  }

  return ReviewModel.getAllReviews();
}

// Obtener reseña por ID
async function getReviewById(id) {
  const review = ReviewModel.getReviewById(id);

  if (!review) {
    const error = new Error('Review not found');
    error.statusCode = 404;
    throw error;
  }

  return review;
}

// Crear reseña
async function createReview(data) {
  const errors = [];

  if (!data.providerId) {
    errors.push('Field "providerId" is required');
  }

  if (!data.agreementId) {
    errors.push('Field "agreementId" is required');
  }

  const rating = data.rating;
  const ratingIsNumber =
    typeof rating === 'number' && !Number.isNaN(rating);

  if (!ratingIsNumber || rating < 1 || rating > 5) {
    errors.push('Field "rating" must be a number between 1 and 5');
  }

  if (errors.length > 0) {
    const error = new Error('Validation error: ' + errors.join('; '));
    error.statusCode = 400;
    throw error;
  }

  // Verificar proveedor
  const provider = ProviderModel.getProviderById(data.providerId);
  if (!provider) {
    const error = new Error('Provider not found for given providerId');
    error.statusCode = 404;
    throw error;
  }

  // Verificar acuerdo
  const agreement = AgreementModel.getAgreementById(data.agreementId);
  if (!agreement) {
    const error = new Error('Agreement not found for given agreementId');
    error.statusCode = 404;
    throw error;
  }

  // Chequear que el acuerdo pertenezca al proveedor
  if (agreement.providerId !== data.providerId) {
    const error = new Error('Agreement does not belong to the given providerId');
    error.statusCode = 400;
    throw error;
  }

  // Chequear que el acuerdo esté cumplido
  if (agreement.status !== 'cumplido') {
    const error = new Error('Agreement must be "cumplido" before creating a review');
    error.statusCode = 400;
    throw error;
  }

  // Chequear que no exista ya una reseña para este acuerdo
  const existingReviewsForAgreement =
    ReviewModel.getReviewsByAgreementId(data.agreementId);

  if (existingReviewsForAgreement.length > 0) {
    const error = new Error('There is already a review for this agreement');
    error.statusCode = 400;
    throw error;
  }

  const newReview = ReviewModel.createReview({
    providerId: data.providerId,
    agreementId: data.agreementId,
    rating,
    authorName: data.authorName,
    comment: data.comment
  });

  return newReview;
}

// Actualizar reseña
async function updateReview(id, data) {
  // No permitimos cambiar providerId o agreementId aquí
  if (data.providerId || data.agreementId) {
    const error = new Error('Cannot change providerId or agreementId on a review');
    error.statusCode = 400;
    throw error;
  }

  if (data.rating !== undefined) {
    const rating = data.rating;
    const ratingIsNumber =
      typeof rating === 'number' && !Number.isNaN(rating);

    if (!ratingIsNumber || rating < 1 || rating > 5) {
      const error = new Error('Field "rating" must be a number between 1 and 5');
      error.statusCode = 400;
      throw error;
    }
  }

  const updatedReview = ReviewModel.updateReview(id, data);

  if (!updatedReview) {
    const error = new Error('Review not found');
    error.statusCode = 404;
    throw error;
  }

  return updatedReview;
}

// Eliminar reseña
async function deleteReview(id) {
  const deleted = ReviewModel.deleteReview(id);

  if (!deleted) {
    const error = new Error('Review not found');
    error.statusCode = 404;
    throw error;
  }

  return true;
}

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
};
