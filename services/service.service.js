// services/service.service.js

const ServiceModel = require('../models/service.model');
const providerService = require('../services/provider.service');

async function getAllServices(filter = {}) {
  const { providerId, category, zone } = filter;

  let services;

  if (providerId) {
    services = ServiceModel.getServicesByProviderId(providerId);
  } else {
    services = ServiceModel.getAllServices();
  }

  if (category) {
    services = services.filter((s) => s.category === category);
  }

  if (zone) {
    const providers = await providerService.getAllProviders();
    const providerIdsInZone = providers
      .filter((p) => p.zone === zone)
      .map((p) => p.id);

    services = services.filter((s) => providerIdsInZone.includes(s.providerId));
  }

  return services;
}


// Obtener un servicio por ID
async function getServiceById(id) {
  const service = ServiceModel.getServiceById(id);

  if (!service) {
    const error = new Error('Service not found');
    error.statusCode = 404;
    throw error;
  }

  return service;
}

// Crear un servicio
async function createService(data) {
  const errors = [];

  if (!data.providerId) {
    errors.push('Field "providerId" is required');
  }

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Field "title" is required and must be a non-empty string');
  }

  const hasMoney =
    typeof data.priceAmount === 'number' && !Number.isNaN(data.priceAmount);
  const hasHours =
    typeof data.exchangeHours === 'number' && !Number.isNaN(data.exchangeHours);

  if (!hasMoney && !hasHours) {
    errors.push(
      'At least one of "priceAmount" (dinero) or "exchangeHours" (horas) must be provided'
    );
  }

  if (errors.length > 0) {
    const error = new Error('Validation error: ' + errors.join('; '));
    error.statusCode = 400;
    throw error;
  }

  // Verificar que exista el proveedor
  const provider = ProviderModel.getProviderById(data.providerId);
  if (!provider) {
    const error = new Error('Provider not found for given providerId');
    error.statusCode = 404;
    throw error;
  }

  const newService = ServiceModel.createService({
    providerId: data.providerId,
    title: data.title,
    description: data.description,
    category: data.category,
    priceAmount: hasMoney ? data.priceAmount : null,
    priceCurrency: hasMoney ? data.priceCurrency || 'ARS' : null,
    exchangeHours: hasHours ? data.exchangeHours : null,
    exchangeUnit: hasHours ? data.exchangeUnit || 'horas' : null
  });

  return newService;
}

// Actualizar un servicio
async function updateService(id, data) {
  // Si cambian el providerId, verificar que el proveedor exista
  if (data.providerId) {
    const provider = ProviderModel.getProviderById(data.providerId);
    if (!provider) {
      const error = new Error('Provider not found for given providerId');
      error.statusCode = 404;
      throw error;
    }
  }

  // Validación básica opcional: si mandan priceAmount/exchangeHours, chequear coherencia
  const hasMoney =
    data.priceAmount !== undefined &&
    typeof data.priceAmount === 'number' &&
    !Number.isNaN(data.priceAmount);

  const hasHours =
    data.exchangeHours !== undefined &&
    typeof data.exchangeHours === 'number' &&
    !Number.isNaN(data.exchangeHours);

  if (data.priceAmount !== undefined && !hasMoney) {
    const error = new Error('"priceAmount" must be a valid number');
    error.statusCode = 400;
    throw error;
  }

  if (data.exchangeHours !== undefined && !hasHours) {
    const error = new Error('"exchangeHours" must be a valid number');
    error.statusCode = 400;
    throw error;
  }

  const updatedService = ServiceModel.updateService(id, data);

  if (!updatedService) {
    const error = new Error('Service not found');
    error.statusCode = 404;
    throw error;
  }

  return updatedService;
}

// Eliminar un servicio
async function deleteService(id) {
  const deleted = ServiceModel.deleteService(id);

  if (!deleted) {
    const error = new Error('Service not found');
    error.statusCode = 404;
    throw error;
  }

  return true;
}

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};
