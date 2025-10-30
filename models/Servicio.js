const mongoose = require('mongoose');

const ServicioSchema = new mongoose.Schema({
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedor', required: true },
    titulo: String,
    categoria: String,
    precio: Number,
    horasIntercambio: Number,
    aceptaDinero: Boolean,
    aceptaHoras: Boolean,
    activo: { type: Boolean, default: true }
});

module.exports = mongoose.model('Servicio', ServicioSchema);
