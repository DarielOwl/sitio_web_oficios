const resenaService = require('../services/resenaService');
const Proveedor = require('../models/Proveedor');

exports.listarParaProveedor = async (req, res) => {
  const proveedor = await Proveedor.findOne({ usuario: req.user._id });
  const resenas = await resenaService.listarParaProveedor(proveedor._id);
  res.render('proveedor/resenas/lista', { resenas });
};
