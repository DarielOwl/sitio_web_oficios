// ---------------------------------------------
// Core & Setup
// ---------------------------------------------
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');

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

// Archivos estáticos (Tailwind compilado, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---------------------------------------------
// Conexión a MongoDB
// ---------------------------------------------
const {
  MONGO_URI,
  MONGO_HOST = 'localhost',
  MONGO_PORT = 27017,
  MONGO_DB = 'sitio_oficios',
  MONGO_USER,
  MONGO_PASS,
  MONGO_AUTH_SOURCE = 'admin',
} = process.env;

// si el usuario define MONGO_URI, usamos eso tal cual
const mongoUrl =
  MONGO_URI || `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

const mongoOptions = {};

// si hay user/pass, los pasamos (docker-compose los tiene)
if (MONGO_USER && MONGO_PASS) {
  mongoOptions.auth = { username: MONGO_USER, password: MONGO_PASS };
  mongoOptions.authSource = MONGO_AUTH_SOURCE;
}

mongoose
  .connect(mongoUrl, mongoOptions)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error al conectar con MongoDB:', err));

// ---------------------------------------------
// Rutas
// ---------------------------------------------
const proveedorRouter = require('./routes/proveedor');

// ---------------------------------------------
// Services
// ---------------------------------------------
// Ruta raíz (renderiza la vista principal con datos reales)
const proveedorService = require('./services/proveedorService');

app.get('/', async (req, res) => {
  try {
    // Obtener lista de proveedores desde MongoDB
    const proveedores = await proveedorService.obtenerProveedores();

    // Renderizar la vista 'index.ejs' pasando los datos
    res.render('index', { proveedores });
  } catch (error) {
    console.error('Error al cargar proveedores:', error);
    // En caso de error, renderiza igualmente la vista sin datos
    res.render('index', { proveedores: [] });
  }
});


// Rutas de proveedores
app.use('/proveedor', proveedorRouter);

// ---------------------------------------------
// Servidor
// ---------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
