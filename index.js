const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
const providerRoutes = require('./routes/provider.routes');
const serviceRoutes = require('./routes/service.routes');
const agreementRoutes = require('./routes/agreement.routes');
const reviewRoutes = require('./routes/review.routes');

app.use('/providers', providerRoutes);
app.use('/services', serviceRoutes);
app.use('/agreements', agreementRoutes);
app.use('/reviews', reviewRoutes);

// Rutas vistas
const providerViewRoutes = require('./routes/provider.view.routes');
app.use('/proveedores', providerViewRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
