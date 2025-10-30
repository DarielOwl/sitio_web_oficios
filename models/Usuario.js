const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, enum: ['visitante', 'proveedor', 'solicitante'], default: 'visitante' }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
