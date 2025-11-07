// ---------------------------------------------
// Core & Setup
// ---------------------------------------------
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const session = require('express-session');              // NEW
const { attachUser } = require('./middlewares/authMiddleware'); // NEW

// Cargar variables de entorno (.env)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------------------------
// Middlewares
// ---------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Session (en memoria, suficiente para la tarea)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Cargar usuario en cada request
app.use(attachUser);

// Archivos estáticos (Tailwind compilado, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---------------------------------------------
// Conexión a MongoDB
// ---------------------------------------------
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sitio_oficios', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error al conectar con MongoDB:', err));

// ---------------------------------------------
// Rutas
// ---------------------------------------------
const proveedorRouter = require('./routes/proveedor');
const authRouter = require('./routes/auth'); // NEW

// ---------------------------------------------
// Services
// ---------------------------------------------
const proveedorService = require('./services/proveedorService');

// Página pública principal
app.get('/', async (req, res) => {
  // si no hay usuario en sesión, mostrar login primero
  if (!req.user) {
    return res.redirect('/auth/login');
  }

  try {
    const proveedores = await proveedorService.obtenerProveedores();
    res.render('index', { proveedores });
  } catch (error) {
    console.error('Error al cargar proveedores:', error);
    res.render('index', { proveedores: [] });
  }
});

// (Opcional) búsqueda: GET /buscar?q=...
app.get('/buscar', async (req, res) => {
  const q = req.query.q || '';
  try {
    const proveedores = await proveedorService.buscarProveedores(q);
    res.render('index', { proveedores });
  } catch (error) {
    console.error('Error al buscar proveedores:', error);
    res.render('index', { proveedores: [] });
  }
});

// Rutas de autenticación
app.use('/auth', authRouter);

// Rutas de proveedores (protegidas por middleware en el router)
app.use('/proveedor', proveedorRouter);

// ---------------------------------------------
// Servidor
// ---------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
