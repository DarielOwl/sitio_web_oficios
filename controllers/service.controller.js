// controllers/service.controller.js

const serviceService = require('../services/service.service');

// GET /services → listar todos (opcional ?providerId=)
async function getAllServices(req, res) {
  try {
    const { providerId } = req.query;
    const services = await serviceService.getAllServices({ providerId });
    return res.status(200).json(services);
  } catch (error) {
    console.error('Error getting services:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// GET /services/:id → obtener uno por id
async function getServiceById(req, res) {
  try {
    const { id } = req.params;
    const service = await serviceService.getServiceById(id);
    return res.status(200).json(service);
  } catch (error) {
    console.error('Error getting service:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
}

// POST /services → crear servicio
async function createService(req, res) {
  try {
    const serviceData = req.body;
    const newService = await serviceService.createService(serviceData);
    return res.status(201).json(newService);
  } catch (error) {
    console.error('Error creating service:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
}

// PUT /services/:id → actualizar servicio
async function updateService(req, res) {
  try {
    const { id } = req.params;
    const serviceData = req.body;
    const updatedService = await serviceService.updateService(id, serviceData);
    return res.status(200).json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
}

// DELETE /services/:id → eliminar servicio
async function deleteService(req, res) {
  try {
    const { id } = req.params;
    await serviceService.deleteService(id);
    return res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting service:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
}

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};
