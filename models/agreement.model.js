// models/agreement.model.js

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'mongoDB', 'agreements.json');

function readAgreementsFile() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // Si no existe el archivo, devolvemos un array vacío
      return [];
    }
    throw err;
  }
}

function writeAgreementsFile(agreements) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(agreements, null, 2), 'utf-8');
}

// Obtener todos los acuerdos
function getAllAgreements() {
  return readAgreementsFile();
}

// Obtener acuerdo por ID
function getAgreementById(id) {
  const agreements = readAgreementsFile();
  return agreements.find((a) => a.id === id);
}

// Obtener acuerdos por proveedor
function getAgreementsByProviderId(providerId) {
  const agreements = readAgreementsFile();
  return agreements.filter((a) => a.providerId === providerId);
}

// Obtener acuerdos por servicio
function getAgreementsByServiceId(serviceId) {
  const agreements = readAgreementsFile();
  return agreements.filter((a) => a.serviceId === serviceId);
}

// Crear acuerdo
function createAgreement(agreementData) {
  const agreements = readAgreementsFile();

  const newId =
    agreements.length > 0
      ? String(
          Math.max(
            ...agreements.map((a) => {
              const num = Number(a.id);
              return Number.isNaN(num) ? 0 : num;
            })
          ) + 1
        )
      : '1';

  const now = new Date().toISOString();

  const newAgreement = {
    id: newId,
    providerId: agreementData.providerId,
    serviceId: agreementData.serviceId || null,
    clientName: agreementData.clientName,
    clientContact: agreementData.clientContact || '',
    type: agreementData.type || 'dinero',
    moneyAmount:
      typeof agreementData.moneyAmount === 'number'
        ? agreementData.moneyAmount
        : null,
    moneyCurrency: agreementData.moneyCurrency || null,
    exchangeHours:
      typeof agreementData.exchangeHours === 'number'
        ? agreementData.exchangeHours
        : null,
    description: agreementData.description || '',
    estimatedDate: agreementData.estimatedDate || null,
    status: agreementData.status || 'pendiente',
    createdAt: now,
    updatedAt: now
  };

  agreements.push(newAgreement);
  writeAgreementsFile(agreements);

  return newAgreement;
}

// Actualizar acuerdo
function updateAgreement(id, agreementData) {
  const agreements = readAgreementsFile();
  const index = agreements.findIndex((a) => a.id === id);

  if (index === -1) {
    return null;
  }

  const updatedAgreement = {
    ...agreements[index],
    ...agreementData,
    id,
    updatedAt: new Date().toISOString()
  };

  agreements[index] = updatedAgreement;
  writeAgreementsFile(agreements);

  return updatedAgreement;
}

// Eliminar acuerdo
function deleteAgreement(id) {
  const agreements = readAgreementsFile();
  const index = agreements.findIndex((a) => a.id === id);

  if (index === -1) {
    return false;
  }

  agreements.splice(index, 1);
  writeAgreementsFile(agreements);

  return true;
}

module.exports = {
  getAllAgreements,
  getAgreementById,
  getAgreementsByProviderId,
  getAgreementsByServiceId,
  createAgreement,
  updateAgreement,
  deleteAgreement
};
