const proveedorService = require('../services/proveedorService');

exports.dashboard = async (req, res) => {
  const data = await proveedorService.resumenDashboard(req.user._id);
  res.render('proveedor/dashboard', data);
};

exports.formPerfil = async (req, res) => {
  const perfil = await proveedorService.obtenerPerfil(req.user._id);
  res.render('proveedor/perfilEditar', { perfil });
};

exports.guardarPerfil = async (req, res) => {
  await proveedorService.guardarPerfil(req.user._id, req.body);
  res.redirect('/proveedor/dashboard');
};
