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

    return res.render('providers/detail', {
      provider,
      services,
      reviews,
      ratingSummary,
      agreements
    });
  } catch (error) {
    console.error('Error rendering provider detail:', error);

    if (error.statusCode === 404) {
      return res.status(404).send('Proveedor no encontrado');
    }

    return res.status(500).send('Error interno al mostrar el proveedor');
  }
}

// GET /proveedores/:id/acuerdos/nuevo → formulario de nuevo acuerdo
async function showNewAgreementForm(req, res) {
  try {
    const { id } = req.params;
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
    } = req.body;

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

    // Si todo sale bien, volvemos al perfil del proveedor
    return res.redirect(`/proveedores/${id}`);
  } catch (error) {
    console.error('Error creating agreement from view:', error);

    // Si hay error, volvemos a mostrar el formulario con mensaje
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

module.exports = {
  showProvidersList,
  showProviderDetail,
  showNewAgreementForm,
  createAgreementFromView
};
