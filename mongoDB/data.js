db.proveedors.insertMany([
  {
    nombre: 'Carlos Mendoza',
    oficio: 'Plomero',
    zona: 'Centro · 2.3 km',
    rating: 4.8,
    totalResenas: 47,
    precioMin: 800,
    precioMax: 1500,
    aceptaTrueque: true,
    etiquetas: ['Reparaciones', 'Instalaciones', 'Destapados'],
    contacto: {
      whatsapp: '5491111111111',
      email: 'carlos.mendoza@example.com'
    }
  },
  {
    nombre: 'Ana Rodríguez',
    oficio: 'Electricista',
    zona: 'Norte · 4.1 km',
    rating: 4.9,
    totalResenas: 89,
    precioMin: 600,
    precioMax: 2000,
    aceptaTrueque: true,
    etiquetas: ['Instalaciones eléctricas', 'Reparaciones', 'Luminarias'],
    contacto: {
      whatsapp: '5492222222222',
      email: 'ana.rodriguez@example.com'
    }
  },
  {
    nombre: 'María González',
    oficio: 'Pintora',
    zona: 'Oeste · 1.8 km',
    rating: 4.6,
    totalResenas: 22,
    precioMin: 500,
    precioMax: 1200,
    aceptaTrueque: false,
    etiquetas: ['Interior', 'Exterior'],
    contacto: {
      whatsapp: '5493333333333',
      email: 'maria.gonzalez@example.com'
    }
  },
  {
    nombre: 'Jorge Pérez',
    oficio: 'Carpintero',
    zona: 'Sur · 3.5 km',
    rating: 4.7,
    totalResenas: 31,
    precioMin: 900,
    precioMax: 2500,
    aceptaTrueque: true,
    etiquetas: ['Muebles', 'Puertas', 'Restauración'],
    contacto: {
      whatsapp: '5494444444444',
      email: 'jorge.perez@example.com'
    }
  },
  {
    nombre: 'Lucía Ramírez',
    oficio: 'Gasista',
    zona: 'Centro · 1.1 km',
    rating: 4.5,
    totalResenas: 15,
    precioMin: 700,
    precioMax: 1600,
    aceptaTrueque: false,
    etiquetas: ['Instalaciones', 'Urgencias'],
    contacto: {
      whatsapp: '5495555555555',
      email: 'lucia.ramirez@example.com'
    }
  },
  {
    nombre: 'Pedro López',
    oficio: 'Albañil',
    zona: 'Norte · 5.0 km',
    rating: 4.3,
    totalResenas: 19,
    precioMin: 1200,
    precioMax: 3000,
    aceptaTrueque: true,
    etiquetas: ['Revoques', 'Refacciones'],
    contacto: {
      whatsapp: '5496666666666',
      email: 'pedro.lopez@example.com'
    }
  },
  {
    nombre: 'Sofía Herrera',
    oficio: 'Jardinera',
    zona: 'Oeste · 2.7 km',
    rating: 4.9,
    totalResenas: 11,
    precioMin: 400,
    precioMax: 900,
    aceptaTrueque: true,
    etiquetas: ['Poda', 'Mantenimiento', 'Riego'],
    contacto: {
      whatsapp: '5497777777777',
      email: 'sofia.herrera@example.com'
    }
  },
  {
    nombre: 'Diego Fernández',
    oficio: 'Técnico PC',
    zona: 'Centro · 0.9 km',
    rating: 4.4,
    totalResenas: 25,
    precioMin: 500,
    precioMax: 1300,
    aceptaTrueque: true,
    etiquetas: ['Formateo', 'Limpieza', 'Armado'],
    contacto: {
      whatsapp: '5498888888888',
      email: 'diego.fernandez@example.com'
    }
  },
  {
    nombre: 'Valentina Díaz',
    oficio: 'Costurera',
    zona: 'Sur · 3.0 km',
    rating: 4.6,
    totalResenas: 14,
    precioMin: 300,
    precioMax: 800,
    aceptaTrueque: false,
    etiquetas: ['Arreglos', 'Diseño'],
    contacto: {
      whatsapp: '5499999999999',
      email: 'valentina.diaz@example.com'
    }
  },
  {
    nombre: 'Miguel Torres',
    oficio: 'Herrero',
    zona: 'Noreste · 6.4 km',
    rating: 4.2,
    totalResenas: 9,
    precioMin: 1500,
    precioMax: 3500,
    aceptaTrueque: true,
    etiquetas: ['Portones', 'Rejas'],
    contacto: {
      whatsapp: '5491010101010',
      email: 'miguel.torres@example.com'
    }
  }
])