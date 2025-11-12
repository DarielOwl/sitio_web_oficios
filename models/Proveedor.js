// models/Proveedor.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const proveedorSchema = new Schema(
  {
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true, unique: true },
    nombrePublico: String,          // opcional, puedes usar el nombre del usuario
    descripcion: String,
    experiencia: String,
    zona: String,
    telefono: String,
    whatsapp: String,
    emailContacto: String,
    disponibilidad: String,
    aceptaTrueque: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Proveedor', proveedorSchema);
