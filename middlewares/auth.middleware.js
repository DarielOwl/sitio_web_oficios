// middlewares/auth.middleware.js

const UserModel = require('../models/user.model');

// Pone el usuario logueado (si existe) en res.locals.currentUser
function attachCurrentUser(req, res, next) {
  const userId = req.session && req.session.userId;

  if (!userId) {
    res.locals.currentUser = null;
    return next();
  }

  const user = UserModel.getUserById(userId);

  if (!user) {
    res.locals.currentUser = null;
    return next();
  }

  res.locals.currentUser = user;
  next();
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
