// models/Usuario.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const usuarioSchema = new Schema(
  {
    nombre: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    rol: {
      type: String,
      enum: ['proveedor', 'solicitante', 'admin'],
      default: 'solicitante',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Usuario', usuarioSchema);
