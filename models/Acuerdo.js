const mongoose = require('mongoose');

const AcuerdoSchema = new mongoose.Schema({
    servicio: { type: mongoose.Schema.Types.ObjectId, ref: 'Servicio', required: true },
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedor', required: true },
    solicitante: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    tipo: { type: String, enum: ['dinero', 'horas'], required: true },
    condiciones: String,
    fechaEstimada: Date,
    estado: { type: String, enum: ['pendiente', 'aceptado', 'rechazado', 'cumplido'], default: 'pendiente' }
});

module.exports = mongoose.model('Acuerdo', AcuerdoSchema);
