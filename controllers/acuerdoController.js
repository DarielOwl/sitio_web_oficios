const acuerdoService = require('../services/acuerdoService');
const Proveedor = require('../models/Proveedor');

exports.listarParaProveedor = async (req, res) => {
  const proveedor = await Proveedor.findOne({ usuario: req.user._id });
  const acuerdos = await acuerdoService.listarParaProveedor(proveedor._id);
  res.render('proveedor/acuerdos/lista', { acuerdos });
};

exports.aceptar = async (req, res) => {
  await acuerdoService.cambiarEstado(req.params.id, 'aceptado');
  res.redirect('/proveedor/acuerdos');
};
