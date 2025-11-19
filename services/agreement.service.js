// services/agreement.service.js

const AgreementModel = require('../models/agreement.model');
const ProviderModel = require('../models/provider.model');
const ServiceModel = require('../models/service.model');

// Listar acuerdos (opcionalmente filtrados)
async function getAllAgreements(filter = {}) {
  const { providerId, serviceId, status } = filter;

  let agreements;

  if (providerId) {
    agreements = AgreementModel.getAgreementsByProviderId(providerId);
  } else if (serviceId) {
    agreements = AgreementModel.getAgreementsByServiceId(serviceId);
  } else {
    agreements = AgreementModel.getAllAgreements();
  }

  if (status) {
    agreements = agreements.filter((a) => a.status === status);
  }

  return agreements;
}

// Obtener un acuerdo por ID
async function getAgreementById(id) {
  const agreement = AgreementModel.getAgreementById(id);

  if (!agreement) {
    const error = new Error('Agreement not found');
    error.statusCode = 404;
    throw error;
  }

  return agreement;
}

// Crear acuerdo
async function createAgreement(data) {
  const errors = [];

  if (!data.providerId) {
    errors.push('Field "providerId" is required');
  }

  if (!data.clientName || typeof data.clientName !== 'string' || data.clientName.trim().length === 0) {
    errors.push('Field "clientName" is required and must be a non-empty string');
  }

  const type = data.type || 'dinero';
  const validTypes = ['dinero', 'horas', 'mixto'];

  if (!validTypes.includes(type)) {
    errors.push('Field "type" must be one of: dinero, horas, mixto');
  }

  const hasMoney =
    typeof data.moneyAmount === 'number' && !Number.isNaN(data.moneyAmount);

  const hasHours =
    typeof data.exchangeHours === 'number' && !Number.isNaN(data.exchangeHours);

  if (type === 'dinero' && !hasMoney) {
    errors.push('For type "dinero", "moneyAmount" must be provided as a number');
  }

  if (type === 'horas' && !hasHours) {
    errors.push('For type "horas", "exchangeHours" must be provided as a number');
  }

  if (type === 'mixto' && !hasMoney && !hasHours) {
    errors.push('For type "mixto", at least one of "moneyAmount" or "exchangeHours" must be provided');
  }

  if (errors.length > 0) {
    const error = new Error('Validation error: ' + errors.join('; '));
    error.statusCode = 400;
    throw error;
  }

  // Verificar proveedor
  const provider = ProviderModel.getProviderById(data.providerId);
  if (!provider) {
    const error = new Error('Provider not found for given providerId');
    error.statusCode = 404;
    throw error;
  }

  // Verificar servicio si se envía serviceId
  if (data.serviceId) {
    const service = ServiceModel.getServiceById(data.serviceId);
    if (!service) {
      const error = new Error('Service not found for given serviceId');
      error.statusCode = 404;
      throw error;
    }

    // Extra: aseguramos que el servicio pertenezca al mismo proveedor
    if (service.providerId !== data.providerId) {
      const error = new Error('Service does not belong to the given providerId');
      error.statusCode = 400;
      throw error;
    }
  }

  const newAgreement = AgreementModel.createAgreement({
    providerId: data.providerId,
    serviceId: data.serviceId || null,
    clientName: data.clientName,
    clientContact: data.clientContact,
    type,
    moneyAmount: hasMoney ? data.moneyAmount : null,
    moneyCurrency: hasMoney ? data.moneyCurrency || 'ARS' : null,
    exchangeHours: hasHours ? data.exchangeHours : null,
    description: data.description,
    estimatedDate: data.estimatedDate,
    status: data.status || 'pendiente'
  });

  return newAgreement;
}

// Actualizar acuerdo
async function updateAgreement(id, data) {
  // Si cambian providerId, verificamos que exista
  if (data.providerId) {
    const provider = ProviderModel.getProviderById(data.providerId);
    if (!provider) {
      const error = new Error('Provider not found for given providerId');
      error.statusCode = 404;
      throw error;
    }
  }

  // Si cambian serviceId, verificamos que exista
  if (data.serviceId) {
    const service = ServiceModel.getServiceById(data.serviceId);
    if (!service) {
      const error = new Error('Service not found for given serviceId');
      error.statusCode = 404;
      throw error;
    }

    if (data.providerId && service.providerId !== data.providerId) {
      const error = new Error('Service does not belong to the given providerId');
      error.statusCode = 400;
      throw error;
    }
  }

  // Validaciones suaves sobre type / amounts si vienen
  if (data.type) {
    const validTypes = ['dinero', 'horas', 'mixto'];
    if (!validTypes.includes(data.type)) {
      const error = new Error('Field "type" must be one of: dinero, horas, mixto');
      error.statusCode = 400;
      throw error;
    }
  }

  if (data.moneyAmount !== undefined) {
    const isValid =
      typeof data.moneyAmount === 'number' && !Number.isNaN(data.moneyAmount);
    if (!isValid && data.moneyAmount !== null) {
      const error = new Error('"moneyAmount" must be a valid number or null');
      error.statusCode = 400;
      throw error;
    }
  }

  if (data.exchangeHours !== undefined) {
    const isValid =
      typeof data.exchangeHours === 'number' && !Number.isNaN(data.exchangeHours);
    if (!isValid && data.exchangeHours !== null) {
      const error = new Error('"exchangeHours" must be a valid number or null');
      error.statusCode = 400;
      throw error;
    }
  }

  const updatedAgreement = AgreementModel.updateAgreement(id, data);

  if (!updatedAgreement) {
    const error = new Error('Agreement not found');
    error.statusCode = 404;
    throw error;
  }

  return updatedAgreement;
}

// Cambiar solo el estado del acuerdo (pendiente/cumplido/cancelado)
async function updateAgreementStatus(id, status) {
  const validStatuses = ['pendiente', 'cumplido', 'cancelado'];
  if (!validStatuses.includes(status)) {
    const error = new Error('Invalid status. Must be one of: pendiente, cumplido, cancelado');
    error.statusCode = 400;
    throw error;
  }

  const updatedAgreement = AgreementModel.updateAgreement(id, { status });

  if (!updatedAgreement) {
    const error = new Error('Agreement not found');
    error.statusCode = 404;
    throw error;
  }

  return updatedAgreement;
}

// Eliminar acuerdo
async function deleteAgreement(id) {
  const deleted = AgreementModel.deleteAgreement(id);

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
