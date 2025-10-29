const Proveedor = require('../models/proveedorModel');

exports.obtenerProveedores = async (categoria, q) => {
  const filtro = {};
  if (categoria) filtro.categoria = categoria;
  if (q) filtro.nombre = new RegExp(q, 'i');
  return await Proveedor.find(filtro).limit(10);
};

exports.obtenerProveedorPorId = async (id) => {
  return await Proveedor.findById(id).populate('reseñas');
};
