// controllers/provider.controller.js

const providerService = require('../services/provider.service');

async function getAllProviders(req, res) {
  try {
    const providers = await providerService.getAllProviders();
    return res.status(200).json(providers);
  } catch (error) {
    console.error('Error getting providers:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getProviderById(req, res) {
  try {
    const { id } = req.params;
    const provider = await providerService.getProviderById(id);
    return res.status(200).json(provider);
  } catch (error) {
    console.error('Error getting provider:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
}

async function createProvider(req, res) {
  try {
    const providerData = req.body;
    const newProvider = await providerService.createProvider(providerData);
    return res.status(201).json(newProvider);
  } catch (error) {
    console.error('Error creating provider:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
}

async function updateProvider(req, res) {
  try {
    const { id } = req.params;
    const providerData = req.body;
    const updatedProvider = await providerService.updateProvider(id, providerData);
    return res.status(200).json(updatedProvider);
  } catch (error) {
    console.error('Error updating provider:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
}

async function deleteProvider(req, res) {
  try {
    const { id } = req.params;
    await providerService.deleteProvider(id);
    return res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting provider:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
}

module.exports = {
  getAllProviders,
  getProviderById,
  createProvider,
  updateProvider,
  deleteProvider
};
