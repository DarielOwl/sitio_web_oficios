// models/provider.model.js

const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    experienceYears: {
      type: Number,
      default: null
    },
    zone: {
      type: String,
      default: ''
    },
    categories: {
      type: [String],
      default: []
    },
    whatsapp: {
      type: String,
      default: ''
    },
    email: {
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


const Provider = mongoose.model('Provider', providerSchema);

module.exports = Provider;
