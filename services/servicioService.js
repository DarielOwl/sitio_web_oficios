const Servicio = require('../models/Servicio');

async function listarPorProveedor(proveedorId) {
  return await Servicio.find({ proveedor: proveedorId });
}

async function crear(proveedorId, data) {
  return await Servicio.create({ proveedor: proveedorId, ...data });
}

async function actualizar(servicioId, data) {
  return await Servicio.findByIdAndUpdate(servicioId, data);
}

async function eliminar(servicioId) {
  return await Servicio.findByIdAndDelete(servicioId);
}

module.exports = { listarPorProveedor, crear, actualizar, eliminar };
