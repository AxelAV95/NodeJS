const express = require('express');
const { createPlan, createAgreement, handleWebhook } = require('../controllers/paypalSubscriptionController');

const router = express.Router();

// Crear un plan de suscripción
router.post('/plans', createPlan);

// Crear un acuerdo de suscripción
router.post('/agreements', createAgreement);

// Manejar webhooks de PayPal
router.post('/webhook', handleWebhook);
router.get('/execute', executeAgreement);
router.get('/cancel', cancelAgreement);

module.exports = router;