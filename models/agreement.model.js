// models/agreement.model.js

const mongoose = require('mongoose');

const agreementSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
      required: true
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      default: null
    },
    clientName: {
      type: String,
      required: true,
      trim: true
    },
    clientContact: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    moneyAmount: {
      type: Number,
      default: null
    },
    moneyCurrency: {
      type: String,
      default: ''
    },
    exchangeHours: {
      type: Number,
      default: null
    },
    description: {
      type: String,
      default: ''
    },
    estimatedDate: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      default: 'pendiente'
    }
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  }
);

const Agreement = mongoose.model('Agreement', agreementSchema);

module.exports = Agreement;
