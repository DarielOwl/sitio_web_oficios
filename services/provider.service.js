// services/provider.service.js

const Provider = require('../models/provider.model');

// Obtener todos los proveedores
async function getAllProviders() {
  const providers = await Provider.find().exec();
  return providers; // docs de Mongoose, con .id disponible
}

// Obtener proveedor por ID
async function getProviderById(id) {
  try {
    const provider = await Provider.findById(id).exec();

    if (!provider) {
      const error = new Error('Provider not found');
      error.statusCode = 404;
      throw error;
    }

    return provider;
  } catch (err) {
    const error = new Error('Provider not found');
    error.statusCode = 404;
    throw error;
  }
}

// Crear proveedor
async function createProvider(data) {
  const provider = await Provider.create({
    name: data.name,
    description: data.description || '',
    experienceYears:
      data.experienceYears === undefined || data.experienceYears === null
        ? null
        : data.experienceYears,
    zone: data.zone || '',
    categories: Array.isArray(data.categories) ? data.categories : [],
    whatsapp: data.whatsapp || '',
    email: data.email || ''
  });

  return provider;
}

// Actualizar proveedor
async function updateProvider(id, data) {
  const updated = await Provider.findByIdAndUpdate(
    id,
    {
      $set: {
        name: data.name,
        description: data.description || '',
        experienceYears:
          data.experienceYears === '' || data.experienceYears === undefined
            ? null
            : data.experienceYears,
        zone: data.zone || '',
        categories: Array.isArray(data.categories) ? data.categories : [],
        whatsapp: data.whatsapp || '',
        email: data.email || ''
      }
    },
    { new: true, runValidators: true }
  ).exec();

  if (!updated) {
    const error = new Error('Provider not found');
    error.statusCode = 404;
    throw error;
  }

  return updated;
}

// Eliminar proveedor
async function deleteProvider(id) {
  const deleted = await Provider.findByIdAndDelete(id).exec();

  if (!deleted) {
    const error = new Error('Provider not found');
    error.statusCode = 404;
    throw error;
  }

  return true;
}

module.exports = {
  getAllProviders,
  getProviderById,
  createProvider,
  updateProvider,
  deleteProvider
};
