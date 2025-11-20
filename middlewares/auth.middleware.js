// middlewares/auth.middleware.js

const userService = require('../services/user.service');

// Pone el usuario logueado (si existe) en res.locals.currentUser
async function attachCurrentUser(req, res, next) {
  try {
    const userId = req.session && req.session.userId;

    if (!userId) {
      res.locals.currentUser = null;
      return next();
    }

    const user = await userService.getUserById(userId);

    res.locals.currentUser = user;
    return next();
  } catch (err) {
    console.error('Error attaching current user:', err.message);
    res.locals.currentUser = null;
    return next();
  }
}

// Middleware para proteger rutas
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
