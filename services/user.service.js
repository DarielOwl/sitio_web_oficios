// services/user.service.js

const crypto = require('crypto');
const User = require('../models/user.model');
const providerService = require('../services/provider.service');

function mapUser(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id.toString();
  if (obj.providerId) {
    obj.providerId = obj.providerId.toString();
  }
  return obj;
}

// Hash de contraseña con pbkdf2
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 310000, 32, 'sha256')
    .toString('hex');

  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || typeof storedHash !== 'string') return false;

  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;

  const [salt, originalHash] = parts;

  const hash = crypto
    .pbkdf2Sync(password, salt, 310000, 32, 'sha256')
    .toString('hex');

  return crypto.timingSafeEqual(
    Buffer.from(hash, 'hex'),
    Buffer.from(originalHash, 'hex')
  );
}

// Registrar usuario nuevo
async function registerUser({ name, email, password }) {
  const errors = [];

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push('Field "email" is required and must be a non-empty string');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Field "password" is required and must have at least 6 characters');
  }

  if (errors.length > 0) {
    const error = new Error('Validation error: ' + errors.join('; '));
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await User.findOne({ email: normalizedEmail }).exec();
  if (existing) {
    const error = new Error('Email is already in use');
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = hashPassword(password);

  // Crear proveedor básico asociado a este usuario, ahora en Mongo
  const provider = await providerService.createProvider({
    name: name || normalizedEmail,
    description: '',
    experienceYears: null,
    zone: '',
    categories: [],
    whatsapp: '',
    email: normalizedEmail
  });

  const userDoc = await User.create({
    name,
    email: normalizedEmail,
    passwordHash,
    providerId: provider.id // provider.id es string del ObjectId
  });

  return mapUser(userDoc);
}

// Autenticar usuario (login)
async function authenticateUser(email, password) {
  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const userDoc = await User.findOne({ email: normalizedEmail }).exec();

  const invalidError = new Error('Invalid email or password');
  invalidError.statusCode = 401;

  if (!userDoc) {
    throw invalidError;
  }

  const isValid = verifyPassword(password, userDoc.passwordHash);
  if (!isValid) {
    throw invalidError;
  }

  return mapUser(userDoc);
}

async function getUserById(id) {
  const userDoc = await User.findById(id).exec();
  if (!userDoc) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return mapUser(userDoc);
}

async function getUserByEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const userDoc = await User.findOne({ email: normalizedEmail }).exec();
  if (!userDoc) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return mapUser(userDoc);
}

module.exports = {
  registerUser,
  authenticateUser,
  getUserById,
  getUserByEmail
};
