// models/Servicio.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const servicioSchema = new Schema(
  {
    proveedor: { type: Schema.Types.ObjectId, ref: 'Proveedor', required: true },
    titulo: { type: String, required: true },
    categoria: String,
    descripcion: String,
    precioMin: Number,
    precioMax: Number,
    aceptaTrueque: { type: Boolean, default: false },
    horasIntercambio: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model('Servicio', servicioSchema);
