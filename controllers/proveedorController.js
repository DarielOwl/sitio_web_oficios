// controllers/proveedorController.js
const proveedorService = require('../services/proveedorService');
const servicioService = require('../services/servicioService');

// Dashboard del proveedor (ya la tendrás, solo de ejemplo)
exports.dashboard = async (req, res) => {
  try {
    const proveedores = await proveedorService.obtenerProveedores();
    res.render('proveedor/dashboard', {
      user: req.user,
      proveedores,
    });
  } catch (err) {
    console.error('Error al cargar proveedores', err);
    res.status(500).render('proveedor/dashboard', {
      user: req.user,
      proveedores: [],
      error: 'No se pudieron cargar los proveedores',
    });
  }
};

exports.mostrarPerfil = async (req, res) => {
  try {
    const proveedor = await proveedorService.obtenerPerfilPorUsuario(
      req.user._id
    );

    res.render('proveedor/perfil', {
      user: req.user,
      proveedor,
      mensajeOk: req.query.ok ? 'Perfil actualizado correctamente.' : null,
      mensajeError: null,
    });
  } catch (err) {
    console.error('Error al cargar perfil de proveedor', err);
    res.status(500).render('proveedor/perfil', {
      user: req.user,
      proveedor: null,
      mensajeOk: null,
      mensajeError: 'No se pudo cargar el perfil.',
    });
  }
};

exports.actualizarPerfil = async (req, res) => {
  try {
    await proveedorService.guardarPerfil(req.user._id, {
      descripcion: req.body.descripcion,
      experiencia: req.body.experiencia,
      zona: req.body.zona,
      telefono: req.body.telefono,
      whatsapp: req.body.whatsapp,
      emailContacto: req.body.emailContacto,
      disponibilidad: req.body.disponibilidad,
      aceptaTrueque: req.body.aceptaTrueque === 'on',
    });

    // redirige con query para mostrar el mensajito verde
    res.redirect('/proveedor/perfil?ok=1');
  } catch (err) {
    console.error('Error al actualizar perfil', err);
    res.status(500).render('proveedor/perfil', {
      user: req.user,
      proveedor: req.body, // para no perder lo que escribiste
      mensajeOk: null,
      mensajeError: 'No se pudieron guardar los cambios.',
    });
  }
};
