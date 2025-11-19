// services/provider.service.js

const ProviderModel = require('../models/provider.model');

async function getAllProviders() {
  const providers = ProviderModel.getAllProviders();
  return providers;
}

async function getProviderById(id) {
  const provider = ProviderModel.getProviderById(id);

  if (!provider) {
    const error = new Error('Provider not found');
    error.statusCode = 404;
    throw error;
  }

  return provider;
}

async function createProvider(data) {
  if (!data.name || !data.whatsapp || !data.email) {
    const error = new Error('Missing required fields: name, whatsapp, email');
    error.statusCode = 400;
    throw error;
  }

  const newProvider = ProviderModel.createProvider({
    name: data.name,
    description: data.description,
    experienceYears: data.experienceYears,
    whatsapp: data.whatsapp,
    email: data.email,
    zone: data.zone,
    categories: data.categories
  });

  return newProvider;
}

async function updateProvider(id, data) {
  const updatedProvider = ProviderModel.updateProvider(id, data);

  if (!updatedProvider) {
    const error = new Error('Provider not found');
    error.statusCode = 404;
    throw error;
  }

  return updatedProvider;
}

async function deleteProvider(id) {
  const deleted = ProviderModel.deleteProvider(id);

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
