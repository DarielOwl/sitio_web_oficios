const mongoose = require('mongoose');

const ProveedorSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  nombre: String,
  descripcion: String,
  experiencia: String,
  contacto: {
    whatsapp: String,
    email: String
  },
  zona: String,
  aceptaTrueque: Boolean,
  ratingPromedio: { type: Number, default: 0 }
});

module.exports = mongoose.model('Proveedor', ProveedorSchema);
