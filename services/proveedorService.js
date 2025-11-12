// services/proveedorService.js
const Proveedor = require('../models/Proveedor');

async function obtenerProveedores(terminoBusqueda = '') {
  const filtro = {};

  if (terminoBusqueda) {
    const regex = new RegExp(terminoBusqueda, 'i');
    filtro.$or = [
      { nombre: regex },
      { categoriaPrincipal: regex },
      { zona: regex },
    ];
  }

  // lista para la página principal / dashboard
  return Proveedor.find(filtro).lean();
}

// Perfil de un proveedor asociado a un usuario
async function obtenerPerfilPorUsuario(usuarioId) {
  return Proveedor.findOne({ usuario: usuarioId }).lean();
}

// Crea o actualiza el perfil del proveedor del usuario
async function guardarPerfil(usuarioId, datos) {
  const proveedor = await Proveedor.findOneAndUpdate(
    { usuario: usuarioId },
    {
      $set: {
        descripcion: datos.descripcion,
        experiencia: datos.experiencia,
        zona: datos.zona,
        telefono: datos.telefono,
        whatsapp: datos.whatsapp,
        emailContacto: datos.emailContacto,
        disponibilidad: datos.disponibilidad,
        aceptaTrueque: datos.aceptaTrueque,
      },
    },
    {
      new: true,
      upsert: true, // si no existe, lo crea
    }
  ).lean();

  return proveedor;
}

module.exports = {
  obtenerProveedores,
  obtenerPerfilPorUsuario,
  guardarPerfil,
};
