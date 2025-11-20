// controllers/agreement.controller.js

const agreementService = require('../services/agreement.service');

// GET /agreements → listar acuerdos (opcional: ?providerId=&serviceId=&status=)
async function getAllAgreements(req, res) {
  try {
    const { providerId, serviceId, status } = req.query;
    const agreements = await agreementService.getAllAgreements({
      providerId,
      serviceId,
      status
    });
    return res.status(200).json(agreements);
  } catch (error) {
    console.error('Error getting agreements:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// GET /agreements/:id → obtener un acuerdo
async function getAgreementById(req, res) {
  try {
    const { id } = req.params;
    const agreement = await agreementService.getAgreementById(id);
    return res.status(200).json(agreement);
  } catch (error) {
    console.error('Error getting agreement:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
}

// POST /agreements → crear acuerdo
async function createAgreement(req, res) {
  try {
    const agreementData = req.body;
    const newAgreement = await agreementService.createAgreement(agreementData);
    return res.status(201).json(newAgreement);
  } catch (error) {
    console.error('Error creating agreement:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
}

// PUT /agreements/:id → actualizar acuerdo completo
async function updateAgreement(req, res) {
  try {
    const { id } = req.params;
    const agreementData = req.body;
    const updatedAgreement = await agreementService.updateAgreement(id, agreementData);
    return res.status(200).json(updatedAgreement);
  } catch (error) {
    console.error('Error updating agreement:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
}

// PATCH /agreements/:id/status → cambiar solo el estado
async function updateAgreementStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedAgreement = await agreementService.updateAgreementStatus(id, status);
    return res.status(200).json(updatedAgreement);
  } catch (error) {
    console.error('Error updating agreement status:', error);
    const statusCode = error.statusCode || 500;
    return res
      .status(statusCode)
      .json({ message: error.message || 'Internal server error' });
  }
}

// DELETE /agreements/:id → eliminar acuerdo
async function deleteAgreement(req, res) {
  try {
    const { id } = req.params;
    await agreementService.deleteAgreement(id);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting agreement:', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
}

module.exports = {
  getAllAgreements,
  getAgreementById,
  createAgreement,
  updateAgreement,
  updateAgreementStatus,
  deleteAgreement
};
