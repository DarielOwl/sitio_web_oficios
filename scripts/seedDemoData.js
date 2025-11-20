// scripts/seedDemoData.js
require('dotenv').config();
const mongoose = require('mongoose');

// Ajustá las rutas si tus modelos están en otro lado:
const Provider = require('../models/provider.model');
const Service = require('../models/service.model');
const Agreement = require('../models/agreement.model');
const Review = require('../models/review.model');

async function main() {
  // 1) Conexión a Mongo
  const {
    MONGO_URI,
    MONGO_HOST = 'localhost',
    MONGO_PORT = '27017',
    MONGO_DB = 'sitio_oficios',
    MONGO_USER,
    MONGO_PASS,
    MONGO_AUTH_SOURCE = 'admin'
  } = process.env;

  const uri =
    MONGO_URI ||
    (MONGO_USER && MONGO_PASS
      ? `mongodb://${encodeURIComponent(MONGO_USER)}:${encodeURIComponent(
          MONGO_PASS
        )}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=${MONGO_AUTH_SOURCE}`
      : `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`);

  console.log('Conectando a Mongo en:', uri);
  await mongoose.connect(uri);
  console.log('✅ Conectado a MongoDB');

  // 2) Limpiar datos anteriores (si no querés borrar, comenta este bloque)
  await Promise.all([
    Provider.deleteMany({}),
    Service.deleteMany({}),
    Agreement.deleteMany({}),
    Review.deleteMany({})
  ]);
  console.log('✅ Colecciones limpiadas (providers, services, agreements, reviews)');

  // 3) Crear al menos 10 proveedores con categorías distintas
  const providersData = [
    {
      name: 'Carlos Pérez',
      description: 'Electricista matriculado con experiencia en instalaciones hogareñas.',
      experienceYears: 8,
      zone: 'Centro',
      categories: ['Electricista'],
      whatsapp: '+598 91 111 111',
      email: 'carlos.electricista@example.com'
    },
    {
      name: 'María González',
      description: 'Plomería en general y urgencias 24hs.',
      experienceYears: 5,
      zone: 'Cordón',
      categories: ['Plomero'],
      whatsapp: '+598 92 222 222',
      email: 'maria.plomera@example.com'
    },
    {
      name: 'Juan Rodríguez',
      description: 'Carpintería a medida, muebles y reparaciones.',
      experienceYears: 10,
      zone: 'Pocitos',
      categories: ['Carpintero'],
      whatsapp: '+598 93 333 333',
      email: 'juan.carpintero@example.com'
    },
    {
      name: 'Laura Silva',
      description: 'Pintura interior y exterior, casas y apartamentos.',
      experienceYears: 6,
      zone: 'Parque Rodó',
      categories: ['Pintor'],
      whatsapp: '+598 94 444 444',
      email: 'laura.pintora@example.com'
    },
    {
      name: 'Diego Fernández',
      description: 'Instalación y reparación de gas domiciliario.',
      experienceYears: 7,
      zone: 'Malvín',
      categories: ['Gasista'],
      whatsapp: '+598 95 555 555',
      email: 'diego.gasista@example.com'
    },
    {
      name: 'Ana López',
      description: 'Mantenimiento de jardines y podas.',
      experienceYears: 4,
      zone: 'Carrasco',
      categories: ['Jardinero'],
      whatsapp: '+598 96 666 666',
      email: 'ana.jardinera@example.com'
    },
    {
      name: 'Sergio Díaz',
      description: 'Cerrajero 24hs, apertura de puertas y cambio de cerraduras.',
      experienceYears: 9,
      zone: 'Ciudad Vieja',
      categories: ['Cerrajero'],
      whatsapp: '+598 97 777 777',
      email: 'sergio.cerrajero@example.com'
    },
    {
      name: 'Lucía Martínez',
      description: 'Soporte técnico de PC y redes hogareñas.',
      experienceYears: 3,
      zone: 'La Blanqueada',
      categories: ['Informática'],
      whatsapp: '+598 98 888 888',
      email: 'lucia.soporte@example.com'
    },
    {
      name: 'Pablo Hernández',
      description: 'Trabajos de albañilería y refacciones.',
      experienceYears: 12,
      zone: 'Reducto',
      categories: ['Albañil'],
      whatsapp: '+598 99 999 999',
      email: 'pablo.albanil@example.com'
    },
    {
      name: 'Valentina Suárez',
      description: 'Cuidado de niños por horas, referencias comprobables.',
      experienceYears: 4,
      zone: 'Tres Cruces',
      categories: ['Niñera'],
      whatsapp: '+598 91 000 000',
      email: 'valentina.ninera@example.com'
    }
  ];

  const providers = await Provider.insertMany(providersData);
  console.log(`✅ Insertados ${providers.length} proveedores`);

  // 4) Crear servicios para cada proveedor
  const services = [];

  for (const provider of providers) {
    const baseZone = provider.zone || 'Zona a coordinar';

    const providerServicesData = [
      {
        providerId: provider._id,
        title: `Servicio principal de ${provider.name}`,
        description: `Servicio estándar ofrecido por ${provider.name} en la zona ${baseZone}.`,
        category: provider.categories[0] || 'General',
        priceAmount: 1500,
        priceCurrency: 'UYU',
        exchangeHours: null,
        exchangeUnit: null
      },
      {
        providerId: provider._id,
        title: `Trueque por horas con ${provider.name}`,
        description: 'Opción de intercambio por horas de trabajo según acuerdo.',
        category: provider.categories[0] || 'General',
        priceAmount: null,
        priceCurrency: null,
        exchangeHours: 3,
        exchangeUnit: 'horas'
      }
    ];

    const created = await Service.insertMany(providerServicesData);
    services.push(...created);
  }

  console.log(`✅ Insertados ${services.length} servicios`);

  // 5) Crear acuerdos y reseñas
  //    - Todos los proveedores tienen al menos 1 acuerdo y 1 reseña
  //    - Los acuerdos quedan en estado "cumplido" para que la reseña tenga sentido
  const agreements = [];
  const reviews = [];

  for (const provider of providers) {
    // Tomamos el primer servicio de este proveedor
    const providerService = services.find(
      (s) => String(s.providerId) === String(provider._id)
    );

    const agreement = await Agreement.create({
      providerId: provider._id,
      serviceId: providerService ? providerService._id : null,
      clientName: 'Cliente de prueba',
      clientContact: 'cliente.demo@example.com',
      type: 'dinero', // podría ser "horas" también
      moneyAmount: 1500,
      moneyCurrency: 'UYU',
      exchangeHours: null,
      description: `Acuerdo de prueba con ${provider.name}`,
      estimatedDate: new Date(),
      status: 'cumplido'
    });

    agreements.push(agreement);

    const review = await Review.create({
      providerId: provider._id,
      agreementId: agreement._id,
      rating: 4, // entre 1 y 5
      authorName: 'Cliente de prueba',
      comment: `Muy buen trabajo de ${provider.name}. Lo recomiendo.`
    });

    reviews.push(review);
  }

  console.log(`✅ Insertados ${agreements.length} acuerdos`);
  console.log(`✅ Insertadas ${reviews.length} reseñas`);

  console.log('✅ Seed completado. Ya tienes:');
  console.log('- Al menos 10 proveedores con categorías distintas');
  console.log('- Cada proveedor con servicios y 1 reseña visible');
  console.log('- Acuerdos en estado "cumplido" con su calificación asociada');

  await mongoose.disconnect();
  console.log('✅ Conexión cerrada. Listo.');
}

main().catch((err) => {
  console.error('❌ Error ejecutando seed:', err);
  process.exit(1);
});
