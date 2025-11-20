// services/agreement.service.js

const Agreement = require('../models/agreement.model');

function mapAgreement(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;

  obj.id = obj._id.toString();

  if (obj.providerId) {
    obj.providerId = obj.providerId.toString();
  }

  if (obj.serviceId) {
    obj.serviceId = obj.serviceId.toString();
  }

  return obj;
}

// Obtener acuerdos (con filtros opcionales)
async function getAllAgreements(filter = {}) {
  const { providerId, serviceId, status } = filter;

  const query = {};

  if (providerId) {
    query.providerId = providerId;
  }

  if (serviceId) {
    query.serviceId = serviceId;
  }

  if (status) {
    query.status = status;
  }

  const agreements = await Agreement.find(query).exec();
  return agreements.map(mapAgreement);
}

// Obtener acuerdo por ID
async function getAgreementById(id) {
  try {
    const agreement = await Agreement.findById(id).exec();

    if (!agreement) {
      const error = new Error('Agreement not found');
      error.statusCode = 404;
      throw error;
    }

    return mapAgreement(agreement);
  } catch (err) {
    const error = new Error('Agreement not found');
    error.statusCode = 404;
    throw error;
  }
}

// Crear acuerdo
async function createAgreement(data) {
  const errors = [];

  if (!data.providerId) {
    errors.push('Field "providerId" is required');
  }

  if (!data.clientName) {
    errors.push('Field "clientName" is required');
  }

  if (errors.length > 0) {
    const error = new Error('Validation error: ' + errors.join('; '));
    error.statusCode = 400;
    throw error;
  }

  const agreement = await Agreement.create({
    providerId: data.providerId,
    serviceId: data.serviceId || null,
    clientName: data.clientName,
    clientContact: data.clientContact || '',
    type: data.type || '',
    moneyAmount:
      data.moneyAmount === '' || data.moneyAmount === undefined
        ? null
        : Number(data.moneyAmount),
    moneyCurrency: data.moneyCurrency || '',
    exchangeHours:
      data.exchangeHours === '' || data.exchangeHours === undefined
        ? null
        : Number(data.exchangeHours),
    description: data.description || '',
    estimatedDate: data.estimatedDate ? new Date(data.estimatedDate) : null,
    status: data.status || 'pendiente'
  });

  return mapAgreement(agreement);
}

// Actualizar acuerdo completo
async function updateAgreement(id, data) {
  const update = {
    serviceId: data.serviceId || null,
    clientName: data.clientName,
    clientContact: data.clientContact || '',
    type: data.type || '',
    moneyAmount:
      data.moneyAmount === '' || data.moneyAmount === undefined
        ? null
        : Number(data.moneyAmount),
    moneyCurrency: data.moneyCurrency || '',
    exchangeHours:
      data.exchangeHours === '' || data.exchangeHours === undefined
        ? null
        : Number(data.exchangeHours),
    description: data.description || '',
    estimatedDate: data.estimatedDate ? new Date(data.estimatedDate) : null
  };

  const updated = await Agreement.findByIdAndUpdate(
    id,
    { $set: update },
    { new: true, runValidators: true }
  ).exec();

  if (!updated) {
    const error = new Error('Agreement not found');
    error.statusCode = 404;
    throw error;
  }

  return mapAgreement(updated);
}

// Actualizar solo el estado
async function updateAgreementStatus(id, status) {
  const updated = await Agreement.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true, runValidators: true }
  ).exec();

  if (!updated) {
    const error = new Error('Agreement not found');
    error.statusCode = 404;
    throw error;
  }

  return mapAgreement(updated);
}

// Eliminar acuerdo
async function deleteAgreement(id) {
  const deleted = await Agreement.findByIdAndDelete(id).exec();

  if (!deleted) {
    const error = new Error('Agreement not found');
    error.statusCode = 404;
    throw error;
  }

  return true;
}

module.exports = {
  getAllAgreements,
  getAgreementById,
  createAgreement,
  updateAgreement,
  updateAgreementStatus,
  deleteAgreement
};
