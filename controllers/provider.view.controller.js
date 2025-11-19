// controllers/provider.view.controller.js

const providerService = require('../services/provider.service');
const serviceService = require('../services/service.service');
const reviewService = require('../services/review.service'); // <-- NUEVO

// GET /proveedores → lista HTML de proveedores
async function showProvidersList(req, res) {
  try {
    const providers = await providerService.getAllProviders();
    return res.render('providers/list', { providers });
  } catch (error) {
    console.error('Error rendering providers list:', error);
    return res.status(500).send('Error interno al mostrar la lista de proveedores');
  }
}

// GET /proveedores/:id → perfil HTML de proveedor
async function showProviderDetail(req, res) {
  try {
    const { id } = req.params;
    const provider = await providerService.getProviderById(id);

    const services = await serviceService.getAllServices({ providerId: id });
    const reviews = await reviewService.getAllReviews({ providerId: id }); // <-- NUEVO

    return res.render('providers/detail', {
      provider,
      services,
      reviews // <-- NUEVO
    });
  } catch (error) {
    console.error('Error rendering provider detail:', error);

    if (error.statusCode === 404) {
      return res.status(404).send('Proveedor no encontrado');
    }

    return res.status(500).send('Error interno al mostrar el proveedor');
  }
}

module.exports = {
  showProvidersList,
  showProviderDetail
};
