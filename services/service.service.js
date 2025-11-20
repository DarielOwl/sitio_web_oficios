// services/service.service.js

const Service = require('../models/service.model');
const providerService = require('../services/provider.service');

function mapService(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id.toString();
  if (obj.providerId) {
    obj.providerId = obj.providerId.toString();
  }
  return obj;
}

// Obtener servicios (con filtros opcionales)
async function getAllServices(filter = {}) {
  const { providerId, category, zone } = filter;

  const query = {};

  if (providerId) {
    query.providerId = providerId;
  }

  if (category) {
    query.category = category;
  }

  let services = await Service.find(query).exec();
  let result = services.map(mapService);

  if (zone) {
    const providers = await providerService.getAllProviders();
    const providerIdsInZone = providers
      .filter((p) => p.zone === zone)
      .map((p) => p.id);

    result = result.filter((s) => providerIdsInZone.includes(s.providerId));
  }

  return result;
}

// Obtener servicio por ID
async function getServiceById(id) {
  try {
    const service = await Service.findById(id).exec();
    if (!service) {
      const error = new Error('Service not found');
      error.statusCode = 404;
      throw error;
    }
    return mapService(service);
  } catch (err) {
    const error = new Error('Service not found');
    error.statusCode = 404;
    throw error;
  }
}

// Crear servicio
async function createService(data) {
  const errors = [];

  if (!data.providerId) {
    errors.push('Field "providerId" is required');
  }

  if (!data.title || typeof data.title !== 'string') {
    errors.push('Field "title" is required and must be a string');
  }

  if (errors.length > 0) {
    const error = new Error('Validation error: ' + errors.join('; '));
    error.statusCode = 400;
    throw error;
  }

  const service = await Service.create({
    providerId: data.providerId,
    title: data.title,
    description: data.description || '',
    category: data.category || '',
    priceAmount:
      data.priceAmount === '' || data.priceAmount === undefined
        ? null
        : Number(data.priceAmount),
    priceCurrency: data.priceCurrency || '',
    exchangeHours:
      data.exchangeHours === '' || data.exchangeHours === undefined
        ? null
        : Number(data.exchangeHours),
    exchangeUnit: data.exchangeUnit || ''
  });

  return mapService(service);
}

// Actualizar servicio
async function updateService(id, data) {
  const update = {
    title: data.title,
    description: data.description || '',
    category: data.category || '',
    priceAmount:
      data.priceAmount === '' || data.priceAmount === undefined
        ? null
        : Number(data.priceAmount),
    priceCurrency: data.priceCurrency || '',
    exchangeHours:
      data.exchangeHours === '' || data.exchangeHours === undefined
        ? null
        : Number(data.exchangeHours),
    exchangeUnit: data.exchangeUnit || ''
  };

  const updated = await Service.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true, runValidators: true }
  ).exec();

  if (!updated) {
    const error = new Error('Service not found');
    error.statusCode = 404;
    throw error;
  }

  return mapService(updated);
}

// Eliminar servicio
async function deleteService(id) {
  const deleted = await Service.findByIdAndDelete(id).exec();

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
