// services/review.service.js

const Review = require('../models/review.model');

function mapReview(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;

  obj.id = obj._id.toString();

  if (obj.providerId) {
    obj.providerId = obj.providerId.toString();
  }

  if (obj.agreementId) {
    obj.agreementId = obj.agreementId.toString();
  }

  return obj;
}

// Obtener reseñas (con filtros opcionales)
async function getAllReviews(filter = {}) {
  const { providerId, agreementId } = filter;

  const query = {};

  if (providerId) {
    query.providerId = providerId;
  }

  if (agreementId) {
    query.agreementId = agreementId;
  }

  const reviews = await Review.find(query).sort({ createdAt: -1 }).exec();
  return reviews.map(mapReview);
}

// Obtener reseña por ID
async function getReviewById(id) {
  try {
    const review = await Review.findById(id).exec();

    if (!review) {
      const error = new Error('Review not found');
      error.statusCode = 404;
      throw error;
    }

    return mapReview(review);
  } catch (err) {
    const error = new Error('Review not found');
    error.statusCode = 404;
    throw error;
  }
}

// Crear reseña
async function createReview(data) {
  const errors = [];

  if (!data.providerId) {
    errors.push('Field "providerId" is required');
  }

  if (
    data.rating === undefined ||
    data.rating === null ||
    Number.isNaN(Number(data.rating))
  ) {
    errors.push('Field "rating" is required and must be a number');
  } else {
    const r = Number(data.rating);
    if (r < 1 || r > 5) {
      errors.push('Field "rating" must be between 1 and 5');
    }
  }

  if (errors.length > 0) {
    const error = new Error('Validation error: ' + errors.join('; '));
    error.statusCode = 400;
    throw error;
  }

  const review = await Review.create({
    providerId: data.providerId,
    agreementId: data.agreementId || null,
    rating: Number(data.rating),
    authorName: data.authorName || '',
    comment: data.comment || ''
  });

  return mapReview(review);
}

// Actualizar reseña
async function updateReview(id, data) {
  const update = {};

  if (data.rating !== undefined) {
    const r = Number(data.rating);
    if (Number.isNaN(r) || r < 1 || r > 5) {
      const error = new Error('Field "rating" must be between 1 and 5');
      error.statusCode = 400;
      throw error;
    }
    update.rating = r;
  }

  if (data.authorName !== undefined) {
    update.authorName = data.authorName || '';
  }

  if (data.comment !== undefined) {
    update.comment = data.comment || '';
  }

  const updated = await Review.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true, runValidators: true }
  ).exec();

  if (!updated) {
    const error = new Error('Review not found');
    error.statusCode = 404;
    throw error;
  }

  return mapReview(updated);
}

// Eliminar reseña
async function deleteReview(id) {
  const deleted = await Review.findByIdAndDelete(id).exec();

  if (!deleted) {
    const error = new Error('Review not found');
    error.statusCode = 404;
    throw error;
  }

  return true;
}

// Resumen de reputación de un proveedor
async function getProviderRatingSummary(providerId) {
  const reviews = await Review.find({ providerId }).select('rating').exec();

  if (!reviews || reviews.length === 0) {
    return {
      providerId,
      averageRating: 0,
      totalReviews: 0
    };
  }

  const totalReviews = reviews.length;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const averageRating = sum / totalReviews;

  return {
    providerId,
    averageRating,
    totalReviews
  };
}

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getProviderRatingSummary
};
