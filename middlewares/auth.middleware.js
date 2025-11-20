// middlewares/auth.middleware.js

const userService = require('../services/user.service');

async function attachCurrentUser(req, res, next) {
  // info del usuario disponible en todas las vistas
  res.locals.currentUser = null;

  // path actual para marcar el link activo en el header
  res.locals.currentPath = req.path || '';

  const userId = req.session && req.session.userId;
  if (!userId) {
    return next();
  }

  try {
    const user = await userService.getUserById(userId);
    res.locals.currentUser = user;
  } catch (error) {
    console.error('Error attaching current user:', error);
  }

  return next();
}

function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.redirect('/auth/login');
  }
  next();
}

module.exports = {
  attachCurrentUser,
  requireAuth
};
