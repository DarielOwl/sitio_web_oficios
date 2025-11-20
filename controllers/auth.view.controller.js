// controllers/auth.view.controller.js

const userService = require('../services/user.service');

// GET /auth/register (proveedor)
function showRegisterForm(req, res) {
  if (res.locals.currentUser) {
    return res.redirect('/');
  }

  return res.render('auth/register', {
    errorMessage: null
  });
}

// POST /auth/register (proveedor)
async function register(req, res) {
  try {
    const { name, email, password } = req.body || {};

    const user = await userService.registerUser({
      name,
      email,
      password,
      role: 'provider'
    });

    req.session.userId = user.id;

    if (user.providerId) {
      return res.redirect(`/proveedores/${user.providerId}`);
    }

    return res.redirect('/');
  } catch (error) {
    console.error('Error registering provider:', error);

    return res.status(error.statusCode || 400).render('auth/register', {
      errorMessage: error.message || 'Error al registrarse'
    });
  }
}

// GET /auth/register-client (cliente)
function showClientRegisterForm(req, res) {
  if (res.locals.currentUser) {
    return res.redirect('/');
  }

  return res.render('auth/registerClient', {
    errorMessage: null
  });
}

// POST /auth/register-client (cliente)
async function registerClient(req, res) {
  try {
    const { name, email, password } = req.body || {};

    const user = await userService.registerUser({
      name,
      email,
      password,
      role: 'client'
    });

    req.session.userId = user.id;

    return res.redirect('/');
  } catch (error) {
    console.error('Error registering client:', error);

    return res.status(error.statusCode || 400).render('auth/registerClient', {
      errorMessage: error.message || 'Error al registrarse'
    });
  }
}

// GET /auth/login
function showLoginForm(req, res) {
  if (res.locals.currentUser) {
    return res.redirect('/');
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

    if (user.role === 'provider' && user.providerId) {
      return res.redirect(`/proveedores/${user.providerId}`);
    }

    return res.redirect('/');
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
  showClientRegisterForm,
  registerClient,
  showLoginForm,
  login,
  logout
};
