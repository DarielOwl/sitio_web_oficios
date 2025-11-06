const Acuerdo = require('../models/Acuerdo');

async function listarParaProveedor(proveedorId) {
    return await Acuerdo.find({ proveedor: proveedorId }).populate('servicio solicitante');
}

async function cambiarEstado(acuerdoId, nuevoEstado) {
    return await Acuerdo.findByIdAndUpdate(acuerdoId, { estado: nuevoEstado });
}

module.exports = { listarParaProveedor, cambiarEstado };
