const Resena = require('../models/Resena');

async function listarParaProveedor(proveedorId) {
    return await Resena.find({ proveedor: proveedorId }).populate('autor');
}

module.exports = { listarParaProveedor };
