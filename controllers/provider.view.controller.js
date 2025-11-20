// controllers/provider.view.controller.js

const providerService = require('../services/provider.service');
const serviceService = require('../services/service.service');
const reviewService = require('../services/review.service');
const agreementService = require('../services/agreement.service');

// GET /proveedores → lista HTML de proveedores
async function showProvidersList(req, res) {
  try {
    const providers = await providerService.getAllProviders();
    return res.render('providers/list', { providers });
  } catch (error) {
    console.error('Error rendering providers list:', error);
    return res.status(500).send('Error interno al mostrar la lista de proveedores');
  }
}

// GET /proveedores/:id → perfil HTML de proveedor
async function showProviderDetail(req, res) {
  try {
    const { id } = req.params;
    const provider = await providerService.getProviderById(id);

    const services = await serviceService.getAllServices({ providerId: id });
    const reviews = await reviewService.getAllReviews({ providerId: id });
    const ratingSummary = await reviewService.getProviderRatingSummary(id);
    const agreements = await agreementService.getAllAgreements({ providerId: id });

    const agreementsWithFlags = agreements.map((agreement) => ({
      ...agreement,
      hasReview: reviews.some((r) => r.agreementId === agreement.id)
    }));

    return res.render('providers/detail', {
      provider,
      services,
      reviews,
      ratingSummary,
      agreements: agreementsWithFlags
    });
  } catch (error) {
    console.error('Error rendering provider detail:', error);

    if (error.statusCode === 404) {
      return res.status(404).send('Proveedor no encontrado');
    }

    return res.status(500).send('Error interno al mostrar el proveedor');
  }
}

// ---------- ACUERDOS DESDE VISTA ----------

// GET /proveedores/:id/acuerdos/nuevo → formulario de nuevo acuerdo
async function showNewAgreementForm(req, res) {
  try {
    const { id } = req.params;

    const currentUser = res.locals.currentUser;
    if (!currentUser || currentUser.role !== 'client') {
      return res
        .status(403)
        .send('Solo los clientes registrados pueden crear acuerdos');
    }

    const provider = await providerService.getProviderById(id);
    const services = await serviceService.getAllServices({ providerId: id });

    return res.render('providers/newAgreement', {
      provider,
      services,
      errorMessage: null
    });
  } catch (error) {
    console.error('Error rendering new agreement form:', error);

    if (error.statusCode === 404) {
      return res.status(404).send('Proveedor no encontrado');
    }

    return res.status(500).send('Error interno al mostrar el formulario de acuerdo');
  }
}

// POST /proveedores/:id/acuerdos → crear acuerdo desde vista
async function createAgreementFromView(req, res) {
  try {
    const { id } = req.params;

    const currentUser = res.locals.currentUser;
    if (!currentUser || currentUser.role !== 'client') {
      return res
        .status(403)
        .send('Solo los clientes registrados pueden crear acuerdos');
    }

    const {
      serviceId,
      clientName,
      clientContact,
      type,
      moneyAmount,
      moneyCurrency,
      exchangeHours,
      description,
      estimatedDate
    } = req.body || {};

    const data = {
      providerId: id,
      serviceId: serviceId && serviceId.trim().length > 0 ? serviceId : null,
      clientName,
      clientContact,
      type,
      moneyAmount: moneyAmount ? Number(moneyAmount) : undefined,
      moneyCurrency,
      exchangeHours: exchangeHours ? Number(exchangeHours) : undefined,
      description,
      estimatedDate: estimatedDate || null
    };

    await agreementService.createAgreement(data);

    return res.redirect(`/proveedores/${id}`);
  } catch (error) {
    console.error('Error creating agreement from view:', error);

    try {
      const { id } = req.params;
      const provider = await providerService.getProviderById(id);
      const services = await serviceService.getAllServices({ providerId: id });

      return res.status(error.statusCode || 400).render('providers/newAgreement', {
        provider,
        services,
        errorMessage: error.message || 'Error al crear el acuerdo'
      });
    } catch (innerError) {
      console.error('Error rendering form after agreement error:', innerError);
      return res.status(500).send('Error interno al procesar el acuerdo');
    }
  }
}

// POST /proveedores/:id/acuerdos/:agreementId/cumplir → marcar acuerdo como cumplido
async function markAgreementAsCompleted(req, res) {
  try {
    const { id: providerId, agreementId } = req.params;

    const currentUser = res.locals.currentUser;
    if (!currentUser || currentUser.role !== 'client') {
      return res
        .status(403)
        .send('Solo los clientes registrados pueden marcar acuerdos como cumplidos');
    }

    await agreementService.updateAgreementStatus(agreementId, 'cumplido');

    return res.redirect(`/proveedores/${providerId}`);
  } catch (error) {
    console.error('Error marking agreement as completed:', error);
    return res.status(error.statusCode || 500).send(error.message || 'Error interno');
  }
}

// ---------- RESEÑAS DESDE VISTA ----------

// GET /proveedores/:id/acuerdos/:agreementId/resenas/nueva → formulario de reseña
async function showNewReviewForm(req, res) {
  try {
    const { id: providerId, agreementId } = req.params;

    const currentUser = res.locals.currentUser;
    if (!currentUser || currentUser.role !== 'client') {
      return res
        .status(403)
        .send('Solo los clientes registrados pueden crear reseñas');
    }

    const provider = await providerService.getProviderById(providerId);
    const agreement = await agreementService.getAgreementById(agreementId);

    if (agreement.providerId !== providerId) {
      return res.status(400).send('El acuerdo no pertenece a este proveedor');
    }

    return res.render('providers/newReview', {
      provider,
      agreement,
      errorMessage: null
    });
  } catch (error) {
    console.error('Error rendering new review form:', error);

    if (error.statusCode === 404) {
      return res.status(404).send('Proveedor o acuerdo no encontrado');
    }

    return res.status(500).send('Error interno al mostrar el formulario de reseña');
  }
}

// POST /proveedores/:id/acuerdos/:agreementId/resenas → crear reseña desde vista
async function createReviewFromView(req, res) {
  try {
    const { id: providerId, agreementId } = req.params;

    const currentUser = res.locals.currentUser;
    if (!currentUser || currentUser.role !== 'client') {
      return res
        .status(403)
        .send('Solo los clientes registrados pueden crear reseñas');
    }

    const { rating, authorName, comment } = req.body || {};

    const data = {
      providerId,
      agreementId,
      rating: rating ? Number(rating) : NaN,
      authorName,
      comment
    };

    await reviewService.createReview(data);

    return res.redirect(`/proveedores/${providerId}`);
  } catch (error) {
    console.error('Error creating review from view:', error);

    try {
      const { id: providerId, agreementId } = req.params;
      const provider = await providerService.getProviderById(providerId);
      const agreement = await agreementService.getAgreementById(agreementId);

      return res.status(error.statusCode || 400).render('providers/newReview', {
        provider,
        agreement,
        errorMessage: error.message || 'Error al crear la reseña'
      });
    } catch (innerError) {
      console.error('Error rendering review form after error:', innerError);
      return res.status(500).send('Error interno al procesar la reseña');
    }
  }
}

// ---------- SERVICIOS DESDE VISTA ----------

// GET /proveedores/:id/servicios/nuevo → formulario nuevo servicio
async function showNewServiceForm(req, res) {
  try {
    const { id } = req.params;

    const currentUser = res.locals.currentUser;
    if (!currentUser || currentUser.providerId !== id) {
      return res.status(403).send('No tienes permiso para gestionar este proveedor');
    }

    const provider = await providerService.getProviderById(id);

    return res.render('providers/newService', {
      provider,
      errorMessage: null
    });
  } catch (error) {
    console.error('Error rendering new service form:', error);

    if (error.statusCode === 404) {
      return res.status(404).send('Proveedor no encontrado');
    }

    return res.status(500).send('Error interno al mostrar el formulario de servicio');
  }
}

// POST /proveedores/:id/servicios → crear servicio desde vista
async function createServiceFromView(req, res) {
  try {
    const { id } = req.params;

    const currentUser = res.locals.currentUser;
    if (!currentUser || currentUser.providerId !== id) {
      return res.status(403).send('No tienes permiso para gestionar este proveedor');
    }

    const {
      title,
      description,
      category,
      priceAmount,
      priceCurrency,
      exchangeHours,
      exchangeUnit
    } = req.body || {};

    const data = {
      providerId: id,
      title,
      description,
      category,
      priceAmount: priceAmount ? Number(priceAmount) : undefined,
      priceCurrency,
      exchangeHours: exchangeHours ? Number(exchangeHours) : undefined,
      exchangeUnit
    };

    await serviceService.createService(data);

    return res.redirect(`/proveedores/${id}`);
  } catch (error) {
    console.error('Error creating service from view:', error);

    try {
      const { id } = req.params;
      const provider = await providerService.getProviderById(id);

      return res.status(error.statusCode || 400).render('providers/newService', {
        provider,
        errorMessage: error.message || 'Error al crear el servicio'
      });
    } catch (innerError) {
      console.error('Error rendering service form after error:', innerError);
      return res.status(500).send('Error interno al procesar el servicio');
    }
  }
}

// GET /proveedores/:id/servicios/:serviceId/editar → formulario editar servicio
async function showEditServiceForm(req, res) {
  try {
    const { id: providerId, serviceId } = req.params;

    const currentUser = res.locals.currentUser;
    if (!currentUser || currentUser.providerId !== providerId) {
      return res.status(403).send('No tienes permiso para gestionar este proveedor');
    }

    const provider = await providerService.getProviderById(providerId);
    const service = await serviceService.getServiceById(serviceId);

    if (service.providerId !== providerId) {
      return res.status(400).send('El servicio no pertenece a este proveedor');
    }

    return res.render('providers/editService', {
      provider,
      service,
      errorMessage: null
    });
  } catch (error) {
    console.error('Error rendering edit service form:', error);

    if (error.statusCode === 404) {
      return res.status(404).send('Proveedor o servicio no encontrado');
    }

    return res.status(500).send('Error interno al mostrar el formulario de edición');
  }
}

// POST /proveedores/:id/servicios/:serviceId/editar → actualizar servicio desde vista
async function updateServiceFromView(req, res) {
  try {
    const { id: providerId, serviceId } = req.params;

    const currentUser = res.locals.currentUser;
    if (!currentUser || currentUser.providerId !== providerId) {
      return res.status(403).send('No tienes permiso para gestionar este proveedor');
    }

    const {
      title,
      description,
      category,
      priceAmount,
      priceCurrency,
      exchangeHours,
      exchangeUnit
    } = req.body || {};

    const data = {
      title,
      description,
      category,
      priceAmount:
        priceAmount === '' || priceAmount === undefined
          ? null
          : Number(priceAmount),
      priceCurrency: priceCurrency || null,
      exchangeHours:
        exchangeHours === '' || exchangeHours === undefined
          ? null
          : Number(exchangeHours),
      exchangeUnit: exchangeUnit || null
    };

    await serviceService.updateService(serviceId, data);

    return res.redirect(`/proveedores/${providerId}`);
  } catch (error) {
    console.error('Error updating service from view:', error);

    try {
      const { id: providerId, serviceId } = req.params;
      const provider = await providerService.getProviderById(providerId);
      const service = await serviceService.getServiceById(serviceId);

      return res.status(error.statusCode || 400).render('providers/editService', {
        provider,
        service,
        errorMessage: error.message || 'Error al actualizar el servicio'
      });
    } catch (innerError) {
      console.error('Error rendering edit service form after error:', innerError);
      return res.status(500).send('Error interno al procesar la actualización');
    }
  }
}

// POST /proveedores/:id/servicios/:serviceId/eliminar → eliminar servicio
async function deleteServiceFromView(req, res) {
  try {
    const { id: providerId, serviceId } = req.params;

    const currentUser = res.locals.currentUser;
    if (!currentUser || currentUser.providerId !== providerId) {
      return res.status(403).send('No tienes permiso para gestionar este proveedor');
    }

    await serviceService.deleteService(serviceId);

    return res.redirect(`/proveedores/${providerId}`);
  } catch (error) {
    console.error('Error deleting service from view:', error);
    return res.status(error.statusCode || 500).send(error.message || 'Error interno');
  }
}

// ---------- PERFIL DEL PROVEEDOR (EDITAR) ----------

// GET /proveedores/:id/editar → formulario editar perfil
async function showEditProviderForm(req, res) {
  try {
    const { id } = req.params;

    const currentUser = res.locals.currentUser;
    if (!currentUser || currentUser.providerId !== id) {
      return res.status(403).send('No tienes permiso para editar este proveedor');
    }

    const provider = await providerService.getProviderById(id);

    return res.render('providers/editProvider', {
      provider,
      errorMessage: null
    });
  } catch (error) {
    console.error('Error rendering edit provider form:', error);

    if (error.statusCode === 404) {
      return res.status(404).send('Proveedor no encontrado');
    }

    return res.status(500).send('Error interno al mostrar el formulario de edición');
  }
}

// POST /proveedores/:id/editar → actualizar perfil desde vista
async function updateProviderFromView(req, res) {
  try {
    const { id } = req.params;

    const currentUser = res.locals.currentUser;
    if (!currentUser || currentUser.providerId !== id) {
      return res.status(403).send('No tienes permiso para editar este proveedor');
    }

    const {
      name,
      description,
      experienceYears,
      zone,
      categories,
      whatsapp,
      email
    } = req.body || {};

    const categoriesArray =
      categories && categories.trim().length > 0
        ? categories
          .split(',')
          .map((c) => c.trim())
          .filter((c) => c.length > 0)
        : [];

    const data = {
      name,
      description,
      experienceYears:
        experienceYears === '' || experienceYears === undefined
          ? null
          : Number(experienceYears),
      zone,
      categories: categoriesArray,
      whatsapp,
      email
    };

    await providerService.updateProvider(id, data);

    return res.redirect(`/proveedores/${id}`);
  } catch (error) {
    console.error('Error updating provider from view:', error);

    try {
      const { id } = req.params;
      const provider = await providerService.getProviderById(id);

      return res.status(error.statusCode || 400).render('providers/editProvider', {
        provider,
        errorMessage: error.message || 'Error al actualizar el proveedor'
      });
    } catch (innerError) {
      console.error('Error rendering edit provider form after error:', innerError);
      return res.status(500).send('Error interno al procesar la actualización');
    }
  }
}

module.exports = {
  showProvidersList,
  showProviderDetail,
  showNewAgreementForm,
  createAgreementFromView,
  markAgreementAsCompleted,
  showNewReviewForm,
  createReviewFromView,
  showNewServiceForm,
  createServiceFromView,
  showEditServiceForm,
  updateServiceFromView,
  deleteServiceFromView,
  showEditProviderForm,
  updateProviderFromView
};
