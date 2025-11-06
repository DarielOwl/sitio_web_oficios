// services/authService.js
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

async function registrarUsuario({ nombre, email, password, rol }) {
  const existente = await Usuario.findOne({ email });
  if (existente) {
    throw new Error('El email ya está registrado');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const usuario = await Usuario.create({
    nombre,
    email,
    passwordHash,
    rol,
  });

  return usuario;
}

async function login(email, password) {
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    throw new Error('Credenciales inválidas');
  }

  const ok = await bcrypt.compare(password, usuario.passwordHash);
  if (!ok) {
    throw new Error('Credenciales inválidas');
  }

  return usuario;
}

module.exports = {
  registrarUsuario,
  login,
};
