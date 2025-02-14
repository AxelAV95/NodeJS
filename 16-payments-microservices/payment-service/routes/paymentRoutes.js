const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createPaymentHandler, executePaymentHandler, handleWebhook } = require('../controllers/paymentController');

const router = express.Router();

router.post('/', authMiddleware, createPaymentHandler);
router.get('/execute',  executePaymentHandler);
router.post('/webhook', handleWebhook);

module.exports = router;