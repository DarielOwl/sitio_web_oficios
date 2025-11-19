// models/service.model.js

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'mongoDB', 'services.json');

function readServicesFile() {
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

function writeServicesFile(services) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(services, null, 2), 'utf-8');
}

// Obtener todos los servicios
function getAllServices() {
  return readServicesFile();
}

// Obtener un servicio por ID
function getServiceById(id) {
  const services = readServicesFile();
  return services.find((s) => s.id === id);
}

// Obtener servicios por ID de proveedor
function getServicesByProviderId(providerId) {
  const services = readServicesFile();
  return services.filter((s) => s.providerId === providerId);
}

// Crear servicio nuevo
function createService(serviceData) {
  const services = readServicesFile();

  const newId =
    services.length > 0
      ? String(
          Math.max(
            ...services.map((s) => {
              const num = Number(s.id);
              return Number.isNaN(num) ? 0 : num;
            })
          ) + 1
        )
      : '1';

  const now = new Date().toISOString();

  const newService = {
    id: newId,
    providerId: serviceData.providerId,
    title: serviceData.title,
    description: serviceData.description || '',
    category: serviceData.category || '',
    priceAmount:
      typeof serviceData.priceAmount === 'number' ? serviceData.priceAmount : null,
    priceCurrency: serviceData.priceCurrency || null,
    exchangeHours:
      typeof serviceData.exchangeHours === 'number' ? serviceData.exchangeHours : null,
    exchangeUnit: serviceData.exchangeUnit || null,
    createdAt: now,
    updatedAt: now
  };

  services.push(newService);
  writeServicesFile(services);

  return newService;
}

// Actualizar servicio
function updateService(id, serviceData) {
  const services = readServicesFile();
  const index = services.findIndex((s) => s.id === id);

  if (index === -1) {
    return null;
  }

  const updatedService = {
    ...services[index],
    ...serviceData,
    id,
    updatedAt: new Date().toISOString()
  };

  services[index] = updatedService;
  writeServicesFile(services);

  return updatedService;
}

// Eliminar servicio
function deleteService(id) {
  const services = readServicesFile();
  const index = services.findIndex((s) => s.id === id);

  if (index === -1) {
    return false;
  }

  services.splice(index, 1);
  writeServicesFile(services);

  return true;
}

module.exports = {
  getAllServices,
  getServiceById,
  getServicesByProviderId,
  createService,
  updateService,
  deleteService
};
