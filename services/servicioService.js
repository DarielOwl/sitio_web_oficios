// services/servicioService.js
const Servicio = require('../models/Servicio');

function listarServiciosDeProveedor(proveedorId) {
  return Servicio.find({ proveedor: proveedorId }).sort({ createdAt: -1 });
}

async function crearServicio(proveedorId, datos) {
  const servicio = new Servicio({
    proveedor: proveedorId,
    titulo: datos.titulo,
    categoria: datos.categoria,
    descripcion: datos.descripcion,
    precioMin: datos.precioMin || null,
    precioMax: datos.precioMax || null,
    aceptaTrueque: datos.aceptaTrueque === 'on' || datos.aceptaTrueque === true,
    horasIntercambio: datos.horasIntercambio || null
  });

  await servicio.save();
  return servicio;
}

function obtenerServicioDeProveedor(proveedorId, servicioId) {
  return Servicio.findOne({ _id: servicioId, proveedor: proveedorId });
}

async function actualizarServicio(proveedorId, servicioId, datos) {
  const servicio = await obtenerServicioDeProveedor(proveedorId, servicioId);
  if (!servicio) return null;

  servicio.titulo = datos.titulo;
  servicio.categoria = datos.categoria;
  servicio.descripcion = datos.descripcion;
  servicio.precioMin = datos.precioMin || null;
  servicio.precioMax = datos.precicioMax || datos.precioMax || null;
  servicio.aceptaTrueque =
    datos.aceptaTrueque === 'on' || datos.aceptaTrueque === true;
  servicio.horasIntercambio = datos.horasIntercambio || null;

  await servicio.save();
  return servicio;
}

async function eliminarServicio(proveedorId, servicioId) {
  await Servicio.deleteOne({ _id: servicioId, proveedor: proveedorId });
}

module.exports = {
  listarServiciosDeProveedor,
  crearServicio,
  obtenerServicioDeProveedor,
  actualizarServicio,
  eliminarServicio
};
