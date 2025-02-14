const { createSubscriptionPlan, createSubscriptionAgreement } = require('../utils/paypal');
const PayPalSubscription = require('../models/paypalSubscriptionModel');
const axios = require('axios');

// Crear un plan de suscripción en PayPal
const createPlan = async (req, res) => {
    const { name, description, price, frequency } = req.body;

    const planData = {
        product_id: 'PROD-123456789', // ID del producto en PayPal
        name,
        description,
        billing_cycles: [
            {
                frequency: {
                    interval_unit: frequency, // 'MONTH' o 'YEAR'
                    interval_count: 1,
                },
                tenure_type: 'REGULAR',
                sequence: 1,
                total_cycles: 0, // 0 para suscripciones indefinidas
                pricing_scheme: {
                    fixed_price: {
                        value: price,
                        currency_code: 'USD',
                    },
                },
            },
        ],
        payment_preferences: {
            auto_bill_outstanding: true,
            setup_fee: {
                value: '0',
                currency_code: 'USD',
            },
        },
    };

    try {
        const plan = await createSubscriptionPlan(planData);
        res.status(201).json({ plan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el plan de suscripción' });
    }
};

// Crear un acuerdo de suscripción en PayPal
const createAgreement = async (req, res) => {
    const { user_id, plan_id, start_date } = req.body;

    const agreementData = {
        plan_id,
        start_time: start_date,
        subscriber: {
            name: {
                given_name: 'John',
                surname: 'Doe',
            },
            email_address: 'john.doe@example.com',
        },
        application_context: {
            return_url: 'http://localhost:3007/subscriptions/execute',
            cancel_url: 'http://localhost:3007/subscriptions/cancel',
        },
    };

    try {
        const agreement = await createSubscriptionAgreement(agreementData);

        // Guardar el acuerdo en la base de datos
        await PayPalSubscription.create({
            user_id,
            plan_id,
            agreement_id: agreement.id,
            status: 'pending',
        });

        // Obtener la URL de aprobación de PayPal
        const approvalUrl = agreement.links.find(link => link.rel === 'approve').href;

        res.json({ approvalUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el acuerdo de suscripción' });
    }
};

// Manejar webhooks de PayPal
const handleWebhook = async (req, res) => {
    const event = req.body;

    try {
        if (event.event_type === 'BILLING.SUBSCRIPTION.ACTIVATED') {
            const agreementId = event.resource.id;

            // Actualizar el estado del acuerdo en la base de datos
            await PayPalSubscription.updateStatus(agreementId, 'active');

            // Notificar al subscription-service para activar la suscripción
            const subscription = await PayPalSubscription.findByAgreementId(agreementId);
            await axios.post('http://subscription-service:3003/subscriptions/activate', {
                subscription_id: subscription.id,
            });
        }

        res.status(200).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al procesar el webhook' });
    }
};

// Ejecutar acuerdo después de la aprobación del usuario
const executeAgreement = async (req, res) => {
    const { token } = req.query;

    try {
        // Capturar el acuerdo usando el token
        const request = new paypal.billing.SubscriptionsGetRequest(token);
        const agreement = await client.execute(request);

        // Actualizar el estado en la base de datos
        await PayPalSubscription.updateStatus(agreement.id, 'active');

        // Redirigir al frontend con un mensaje de éxito
        res.redirect('http://localhost:3000/success?subscription_id=' + agreement.id);

    } catch (error) {
        console.error(error);
        res.redirect('http://localhost:3000/error');
    }
};

// Manejar cancelación de suscripción
const cancelAgreement = async (req, res) => {
    const { token } = req.query;

    try {
        // Actualizar el estado a "cancelado"
        await PayPalSubscription.updateStatus(token, 'cancelled');
        res.redirect('http://localhost:3000/cancel');
    } catch (error) {
        console.error(error);
        res.redirect('http://localhost:3000/error');
    }
};

module.exports = { createPlan, createAgreement, handleWebhook, executeAgreement, cancelAgreement };