const servicioService = require('../services/servicioService');
const Proveedor = require('../models/Proveedor');

exports.listarPropios = async (req, res) => {
    const proveedor = await Proveedor.findOne({ usuario: req.user._id });
    const servicios = await servicioService.listarPorProveedor(proveedor._id);
    res.render('proveedor/servicios/lista', { servicios });
};

exports.crear = async (req, res) => {
    const proveedor = await Proveedor.findOne({ usuario: req.user._id });
    await servicioService.crear(proveedor._id, req.body);
    res.redirect('/proveedor/servicios');
};
