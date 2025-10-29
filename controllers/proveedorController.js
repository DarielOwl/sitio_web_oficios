const proveedorService = require('../services/proveedorService');

exports.listarProveedores = async (req, res) => {
  const { categoria, q } = req.query;
  const proveedores = await proveedorService.obtenerProveedores(categoria, q);
  res.render('pages/listaProveedores', { proveedores });
};

exports.verPerfil = async (req, res) => {
  const proveedor = await proveedorService.obtenerProveedorPorId(req.params.id);
  res.render('pages/perfilProveedor', { proveedor });
};
