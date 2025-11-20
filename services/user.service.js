// services/user.service.js

const crypto = require('crypto');
const UserModel = require('../models/user.model');

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
async function registerUser({ name, email, password, providerId = null }) {
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

  const existing = UserModel.getUserByEmail(email);
  if (existing) {
    const error = new Error('Email is already in use');
    error.statusCode = 409; // conflicto
    throw error;
  }

  const passwordHash = hashPassword(password);

  const newUser = UserModel.createUser({
    name,
    email,
    passwordHash,
    providerId
  });

  return newUser;
}

// Autenticar usuario (login)
async function authenticateUser(email, password) {
  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.statusCode = 400;
    throw error;
  }

  const user = UserModel.getUserByEmail(email);

  // Siempre mismo mensaje para no revelar qué falló
  const invalidError = new Error('Invalid email or password');
  invalidError.statusCode = 401;

  if (!user) {
    throw invalidError;
  }

  const isValid = verifyPassword(password, user.passwordHash);
  if (!isValid) {
    throw invalidError;
  }

  return user;
}

async function getUserById(id) {
  const user = UserModel.getUserById(id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
}

async function getUserByEmail(email) {
  const user = UserModel.getUserByEmail(email);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
}

module.exports = {
  registerUser,
  authenticateUser,
  getUserById,
  getUserByEmail
};
