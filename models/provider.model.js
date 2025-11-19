const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'mongoDB', 'providers.json');

function readProvidersFile() {
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

function writeProvidersFile(providers) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(providers, null, 2), 'utf-8');
}

// Obtener todos los proveedores
function getAllProviders() {
  return readProvidersFile();
}

// Obtener un proveedor por ID
function getProviderById(id) {
  const providers = readProvidersFile();
  return providers.find((p) => p.id === id);
}

// Crear proveedor nuevo
function createProvider(providerData) {
  const providers = readProvidersFile();

  const newId =
    providers.length > 0
      ? String(
          Math.max(
            ...providers.map((p) => {
              const num = Number(p.id);
              return Number.isNaN(num) ? 0 : num;
            })
          ) + 1
        )
      : '1';

  const now = new Date().toISOString();

  const newProvider = {
    id: newId,
    name: providerData.name,
    description: providerData.description || '',
    experienceYears: providerData.experienceYears || 0,
    whatsapp: providerData.whatsapp || '',
    email: providerData.email || '',
    zone: providerData.zone || '',
    categories: providerData.categories || [],
    createdAt: now,
    updatedAt: now
  };

  providers.push(newProvider);
  writeProvidersFile(providers);

  return newProvider;
}

// Actualizar proveedor
function updateProvider(id, providerData) {
  const providers = readProvidersFile();
  const index = providers.findIndex((p) => p.id === id);

  if (index === -1) {
    return null;
  }

  const updatedProvider = {
    ...providers[index],
    ...providerData,
    id,
    updatedAt: new Date().toISOString()
  };

  providers[index] = updatedProvider;
  writeProvidersFile(providers);

  return updatedProvider;
}

// Eliminar proveedor
function deleteProvider(id) {
  const providers = readProvidersFile();
  const index = providers.findIndex((p) => p.id === id);

  if (index === -1) {
    return false;
  }

  providers.splice(index, 1);
  writeProvidersFile(providers);

  return true;
}

module.exports = {
  getAllProviders,
  getProviderById,
  createProvider,
  updateProvider,
  deleteProvider
};
