// controllers/authController.js
const authService = require('../services/authService');

exports.mostrarLogin = (req, res) => {
  res.render('auth/login', { error: null });
};

exports.mostrarRegistro = (req, res) => {
  res.render('auth/register', { error: null });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await authService.login(email, password);

    // Guardamos info mínima en la sesión
    req.session.userId = usuario._id.toString();
    req.session.rol = usuario.rol;

    if (usuario.rol === 'proveedor') {
      return res.redirect('/proveedor/dashboard');
    }

    // solicitante u otros roles → a la página pública
    return res.redirect('/');
  } catch (err) {
    return res.status(401).render('auth/login', { error: err.message });
  }
};

exports.registro = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  try {
    await authService.registrarUsuario({ nombre, email, password, rol });
    return res.redirect('/auth/login');
  } catch (err) {
    return res.status(400).render('auth/register', { error: err.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
