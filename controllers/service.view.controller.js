// controllers/service.view.controller.js

const serviceService = require('../services/service.service');
const providerService = require('../services/provider.service');

async function showServicesList(req, res) {
  try {
    let { category, zone } = req.query;

    if (category === '') category = undefined;
    if (zone === '') zone = undefined;

    const [allServices, filteredServices, providers] = await Promise.all([
      serviceService.getAllServices(),
      serviceService.getAllServices({ category, zone }),
      providerService.getAllProviders()
    ]);

    const categories = [...new Set(allServices.map((s) => s.category).filter(Boolean))];
    const zones = [...new Set(providers.map((p) => p.zone).filter(Boolean))];

    const servicesWithProvider = filteredServices.map((service) => ({
      ...service,
      provider: providers.find((p) => p.id === service.providerId) || null
    }));

    return res.render('services/list', {
      services: servicesWithProvider,
      categories,
      zones,
      selectedCategory: category || '',
      selectedZone: zone || ''
    });
  } catch (error) {
    console.error('Error rendering services list:', error);
    return res.status(500).send('Error interno al mostrar los servicios');
  }
}

module.exports = {
  showServicesList
};
