// controllers/auth.view.controller.js

const userService = require('../services/user.service');

// GET /auth/register
function showRegisterForm(req, res) {
  // Si ya está logueado, lo mando a proveedores
  if (res.locals.currentUser) {
    return res.redirect('/proveedores');
  }

  return res.render('auth/register', {
    errorMessage: null
  });
}

// POST /auth/register
async function register(req, res) {
  try {
    const { name, email, password } = req.body || {};

    const user = await userService.registerUser({
      name,
      email,
      password
      // providerId: por ahora null, luego lo vinculamos si queremos
    });

    req.session.userId = user.id;

    return res.redirect('/proveedores');
  } catch (error) {
    console.error('Error registering user:', error);

    return res.status(error.statusCode || 400).render('auth/register', {
      errorMessage: error.message || 'Error al registrarse'
    });
  }
}

// GET /auth/login
function showLoginForm(req, res) {
  if (res.locals.currentUser) {
    return res.redirect('/proveedores');
  }

  return res.render('auth/login', {
    errorMessage: null
  });
}

// POST /auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body || {};

    const user = await userService.authenticateUser(email, password);

    req.session.userId = user.id;

    return res.redirect('/proveedores');
  } catch (error) {
    console.error('Error logging in:', error);

    return res.status(error.statusCode || 400).render('auth/login', {
      errorMessage: error.message || 'Error al iniciar sesión'
    });
  }
}

// POST /auth/logout
function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/auth/login');
  });
}

module.exports = {
  showRegisterForm,
  register,
  showLoginForm,
  login,
  logout
};
