const express = require('express');
const path = require('path');

const app = express();

// Configurar motor de vistas (ejemplo con EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para JSON
app.use(express.json());

// Rutas API
const providerRoutes = require('./routes/provider.routes');
app.use('/providers', providerRoutes);

// Rutas de vistas
const providerViewRoutes = require('./routes/provider.view.routes');
app.use('/proveedores', providerViewRoutes);

// Static
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
