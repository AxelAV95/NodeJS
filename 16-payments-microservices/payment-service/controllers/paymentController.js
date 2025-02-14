const { createPayment, executePayment } = require('../utils/paypal');
const Payment = require('../models/paymentModel');
const axios = require('axios'); // Importar axios para hacer llamadas HTTP

// Controlador para crear un pago
const createPaymentHandler = async (req, res) => {
    const { amount, subscription_id } = req.body;
    const user_id = req.userId; // Obtenido del middleware de autenticación

    const paymentData = {
        amount: amount.toFixed(2), // Convertir a string con 2 decimales
        currency: 'USD',
    };

    try {
        // Crear la orden de pago en PayPal
        const order = await createPayment(paymentData);

        // Guardar el pago en la base de datos
        const paymentId = order.id;
        await Payment.create({
            user_id,
            subscription_id,
            amount,
            payment_method: 'paypal',
            status: 'pending',
            transaction_id: paymentId,
        });

        // Obtener la URL de aprobación de PayPal
        const approvalUrl = order.links.find(link => link.rel === 'approve').href;

        // Responder con la URL de aprobación
        res.json({ approvalUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el pago' });
    }
};

// Controlador para ejecutar un pago
const executePaymentHandler = async (req, res) => {
    const { token } = req.query;  // Capturar el token de la URL

    try {
        // Ejecutar el pago usando el token (orderId)
        const capture = await executePayment(token);

        if (capture.status === 'COMPLETED') {
            // Actualizar el estado del pago
            await Payment.updateStatus(token, 'completed');

            // Obtener el ID de la suscripción desde la base de datos
            const payment = await Payment.findByTransactionId(token);
            const subscription_id = payment.subscription_id;

            // Notificar al subscription-service para activar la suscripción
            await axios.post('http://localhost:3003/subscriptions/activate', {
                subscription_id: subscription_id,
            });

            res.json({ message: 'Pago completado correctamente', capture });
        } else {
            res.status(400).json({ message: 'El pago no fue completado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al ejecutar el pago' });
    }
};

// Controlador para manejar webhooks de PayPal
const handleWebhook = async (req, res) => {
    const event = req.body;

    try {
        if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
            const orderId = event.resource.id;

            // Actualizar el estado del pago
            await Payment.updateStatus(orderId, 'completed');

            // Obtener el ID de la suscripción desde la base de datos
            const payment = await Payment.findByTransactionId(orderId);
            const subscription_id = payment.subscription_id;

            // Notificar al subscription-service para renovar la suscripción
            await axios.post('http://localhost:3003/subscriptions/renew', {
                subscription_id: subscription_id,
            });
        }
        res.status(200).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al procesar el webhook' });
    }
};

module.exports = { createPaymentHandler, executePaymentHandler, handleWebhook };