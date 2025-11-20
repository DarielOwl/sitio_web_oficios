// middlewares/provider.validation.js

function validateProviderBody(req, res, next) {
  const { name, whatsapp, email, zone, categories } = req.body;

  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Field "name" is required and must be a non-empty string');
  }

  if (!whatsapp || typeof whatsapp !== 'string' || whatsapp.trim().length === 0) {
    errors.push('Field "whatsapp" is required and must be a non-empty string');
  }

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push('Field "email" is required and must be a non-empty string');
  }

  if (zone && typeof zone !== 'string') {
    errors.push('Field "zone" must be a string if provided');
  }

  if (categories && !Array.isArray(categories)) {
    errors.push('Field "categories" must be an array if provided');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation error',
      errors
    });
  }

  next();
}

module.exports = {
  validateProviderBody
};
