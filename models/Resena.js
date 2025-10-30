const mongoose = require('mongoose');

const ResenaSchema = new mongoose.Schema({
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedor', required: true },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    rating: { type: Number, min: 1, max: 5 },
    comentario: String,
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resena', ResenaSchema);
