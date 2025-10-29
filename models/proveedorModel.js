const mongoose = require('mongoose');

const proveedorSchema = new mongoose.Schema({
  nombre: String,
  categoria: String,
  descripcion: String,
  precioMin: Number,
  precioMax: Number,
  aceptaTrueque: Boolean,
  reseñas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reseña' }],
});

module.exports = mongoose.model('Proveedor', proveedorSchema);
