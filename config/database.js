// config/database.js
const mongoose = require('mongoose');

async function connectDB() {
  try {
    // Si tienes MONGO_URI, la usamos directo
    const uri =
      process.env.MONGO_URI ||
      `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}` +
      `@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}` +
      `?authSource=${process.env.MONGO_AUTH_SOURCE}`;

    await mongoose.connect(uri);

    console.log('✅ Conectado a MongoDB');
  } catch (err) {
    console.error('❌ Error al conectar a MongoDB:', err.message);
    // Si falla la conexión, no tiene sentido dejar corriendo el server
    process.exit(1);
  }
}

module.exports = connectDB;
