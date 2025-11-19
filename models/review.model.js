// models/review.model.js

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'mongoDB', 'reviews.json');

function readReviewsFile() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // Si no existe el archivo, devolvemos un array vacío
      return [];
    }
    throw err;
  }
}

function writeReviewsFile(reviews) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(reviews, null, 2), 'utf-8');
}

// Obtener todas las reseñas
function getAllReviews() {
  return readReviewsFile();
}

// Obtener reseña por ID
function getReviewById(id) {
  const reviews = readReviewsFile();
  return reviews.find((r) => r.id === id);
}

// Obtener reseñas por proveedor
function getReviewsByProviderId(providerId) {
  const reviews = readReviewsFile();
  return reviews.filter((r) => r.providerId === providerId);
}

// Obtener reseñas por acuerdo
function getReviewsByAgreementId(agreementId) {
  const reviews = readReviewsFile();
  return reviews.filter((r) => r.agreementId === agreementId);
}

// Crear reseña
function createReview(reviewData) {
  const reviews = readReviewsFile();

  const newId =
    reviews.length > 0
      ? String(
          Math.max(
            ...reviews.map((r) => {
              const num = Number(r.id);
              return Number.isNaN(num) ? 0 : num;
            })
          ) + 1
        )
      : '1';

  const now = new Date().toISOString();

  const newReview = {
    id: newId,
    providerId: reviewData.providerId,
    agreementId: reviewData.agreementId,
    rating: reviewData.rating,
    authorName: reviewData.authorName || 'Anónimo',
    comment: reviewData.comment || '',
    createdAt: now,
    updatedAt: now
  };

  reviews.push(newReview);
  writeReviewsFile(reviews);

  return newReview;
}

// Actualizar reseña
function updateReview(id, reviewData) {
  const reviews = readReviewsFile();
  const index = reviews.findIndex((r) => r.id === id);

  if (index === -1) {
    return null;
  }

  const updatedReview = {
    ...reviews[index],
    ...reviewData,
    id,
    updatedAt: new Date().toISOString()
  };

  reviews[index] = updatedReview;
  writeReviewsFile(reviews);

  return updatedReview;
}

// Eliminar reseña
function deleteReview(id) {
  const reviews = readReviewsFile();
  const index = reviews.findIndex((r) => r.id === id);

  if (index === -1) {
    return false;
  }

  reviews.splice(index, 1);
  writeReviewsFile(reviews);

  return true;
}

module.exports = {
  getAllReviews,
  getReviewById,
  getReviewsByProviderId,
  getReviewsByAgreementId,
  createReview,
  updateReview,
  deleteReview
};
