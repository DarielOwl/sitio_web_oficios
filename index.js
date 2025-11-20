const express = require('express');
const path = require('path');
const session = require('express-session'); // <-- agregar
const app = express();

require('dotenv').config();
const connectDB = require('./config/database');

// Motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sesiones
app.use(
  session({
    secret: 'cambia-este-valor-por-algo-mas-seguro',
    resave: false,
    saveUninitialized: false
  })
);

// Static
app.use(express.static(path.join(__dirname, 'public')));

// Auth middleware (usuario actual)
const { attachCurrentUser } = require('./middlewares/auth.middleware');
app.use(attachCurrentUser);

// Rutas API
const providerRoutes = require('./routes/provider.routes');
const serviceRoutes = require('./routes/service.routes');
const agreementRoutes = require('./routes/agreement.routes');
const reviewRoutes = require('./routes/review.routes');
const homeViewRoutes = require('./routes/home.view.routes');

app.use('/providers', providerRoutes);
app.use('/services', serviceRoutes);
app.use('/agreements', agreementRoutes);
app.use('/reviews', reviewRoutes);
app.use('/', homeViewRoutes);

// Rutas vistas
const providerViewRoutes = require('./routes/provider.view.routes');
const serviceViewRoutes = require('./routes/service.view.routes');
const authViewRoutes = require('./routes/auth.view.routes'); // <-- agregar

app.use('/proveedores', providerViewRoutes);
app.use('/servicios', serviceViewRoutes);
app.use('/auth', authViewRoutes); // <-- agregar



const PORT = process.env.PORT || 3000;

// primero conectamos a la base
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
