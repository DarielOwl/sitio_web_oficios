const express = require('express');
const app = express();
const path = require('path');

// Para poder leer JSON del body
app.use(express.json());

// Importar rutas de proveedores
const providerRoutes = require('./routes/provider.routes');

// Usar las rutas bajo el prefijo /providers
app.use('/providers', providerRoutes);

// Si ya tienes otras rutas, van aquí...

// Servir public si lo usas
app.use(express.static(path.join(__dirname, 'public')));

// Puerto y arranque del servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
