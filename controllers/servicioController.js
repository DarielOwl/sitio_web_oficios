// controllers/servicioController.js
const proveedorService = require('../services/proveedorService');
const servicioService = require('../services/servicioService');

exports.listarPropios = async (req, res) => {
  try {
    const proveedor = await proveedorService.obtenerProveedorDeUsuario(req.user._id);
    const servicios = await servicioService.listarServiciosDeProveedor(proveedor._id);

    res.render('proveedor/servicios', {
      proveedor,
      servicios
    });
  } catch (error) {
    console.error('Error al listar servicios del proveedor:', error);
    res.render('proveedor/servicios', {
      proveedor: null,
      servicios: [],
      error: 'No se pudieron cargar tus servicios'
    });
  }
};

exports.mostrarFormularioNuevo = async (req, res) => {
  const proveedor = await proveedorService.obtenerProveedorDeUsuario(req.user._id);

  res.render('proveedor/servicio-form', {
    proveedor,
    servicio: {},
    tituloVista: 'Crear servicio',
    action: '/proveedor/servicios',
    metodo: 'POST'
  });
};

exports.crear = async (req, res) => {
  try {
    const proveedor = await proveedorService.obtenerProveedorDeUsuario(req.user._id);
    await servicioService.crearServicio(proveedor._id, req.body);
    res.redirect('/proveedor/servicios');
  } catch (error) {
    console.error('Error al crear servicio:', error);
    res.redirect('/proveedor/servicios');
  }
};

exports.mostrarFormularioEditar = async (req, res) => {
  try {
    const proveedor = await proveedorService.obtenerProveedorDeUsuario(req.user._id);
    const servicio = await servicioService.obtenerServicioDeProveedor(
      proveedor._id,
      req.params.id
    );

    if (!servicio) {
      return res.redirect('/proveedor/servicios');
    }

    res.render('proveedor/servicio-form', {
      proveedor,
      servicio,
      tituloVista: 'Editar servicio',
      action: `/proveedor/servicios/${servicio._id}/editar`,
      metodo: 'POST'
    });
  } catch (error) {
    console.error('Error al cargar servicio para edición:', error);
    res.redirect('/proveedor/servicios');
  }
};

exports.actualizar = async (req, res) => {
  try {
    const proveedor = await proveedorService.obtenerProveedorDeUsuario(req.user._id);
    await servicioService.actualizarServicio(proveedor._id, req.params.id, req.body);
    res.redirect('/proveedor/servicios');
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    res.redirect('/proveedor/servicios');
  }
};

exports.eliminar = async (req, res) => {
  try {
    const proveedor = await proveedorService.obtenerProveedorDeUsuario(req.user._id);
    await servicioService.eliminarServicio(proveedor._id, req.params.id);
    res.redirect('/proveedor/servicios');
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    res.redirect('/proveedor/servicios');
  }
};
