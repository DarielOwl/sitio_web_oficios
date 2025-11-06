// middlewares/authMiddleware.js
const Usuario = require('../models/Usuario');

async function attachUser(req, res, next) {
  if (!req.session || !req.session.userId) {
    req.user = null;
    res.locals.currentUser = null;
    return next();
  }

  try {
    const usuario = await Usuario.findById(req.session.userId).lean();
    req.user = usuario;
    res.locals.currentUser = usuario;
  } catch (err) {
    console.error('Error cargando usuario desde sesión:', err);
    req.user = null;
    res.locals.currentUser = null;
  }

  return next();
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.redirect('/auth/login');
  }
  next();
}

function requireRole(roles) {
  const permitidos = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    if (!req.user || !permitidos.includes(req.user.rol)) {
      return res.status(403).send('No autorizado');
    }
    next();
  };
}

module.exports = {
  attachUser,
  requireAuth,
  requireRole,
};
