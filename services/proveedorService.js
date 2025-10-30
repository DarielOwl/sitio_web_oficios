const Proveedor = require('../models/Proveedor');
const Servicio = require('../models/Servicio');
const Acuerdo = require('../models/Acuerdo');
const Resena = require('../models/Resena');

async function obtenerPerfil(userId) {
  return await Proveedor.findOne({ usuario: userId });
}

async function guardarPerfil(userId, data) {
  let proveedor = await Proveedor.findOne({ usuario: userId });
  if (!proveedor) proveedor = new Proveedor({ usuario: userId, ...data });
  else Object.assign(proveedor, data);
  return proveedor.save();
}

async function resumenDashboard(userId) {
  const proveedor = await Proveedor.findOne({ usuario: userId });
  if (!proveedor) return { proveedor: null, servicios: [], acuerdos: [], resenas: [] };

  const servicios = await Servicio.find({ proveedor: proveedor._id }).limit(5);
  const acuerdos  = await Acuerdo.find({ proveedor: proveedor._id }).limit(5);
  const resenas   = await Resena.find({ proveedor: proveedor._id }).limit(5);

  return { proveedor, servicios, acuerdos, resenas };
}

/* 👉 NUEVO: listar proveedores para la portada */
async function obtenerProveedores(filtro = {}, limite = 20) {
  return await Proveedor.find(filtro).limit(limite);
}

module.exports = {
  obtenerPerfil,
  guardarPerfil,
  resumenDashboard,
  obtenerProveedores,   // <-- exportado
};
