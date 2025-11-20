// models/review.model.js

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
      required: true
    },
    agreementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agreement',
      default: null
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    authorName: {
      type: String,
      default: ''
    },
    comment: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
