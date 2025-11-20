// models/service.model.js

const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: ''
    },
    priceAmount: {
      type: Number,
      default: null
    },
    priceCurrency: {
      type: String,
      default: ''
    },
    exchangeHours: {
      type: Number,
      default: null
    },
    exchangeUnit: {
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

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
