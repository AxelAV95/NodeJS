const paypal = require('@paypal/checkout-server-sdk');
const dotenv = require('dotenv');

dotenv.config();

// Configurar el cliente de PayPal
function configurePayPalClient() {
    const environment =
        process.env.PAYPAL_MODE === 'live'
            ? new paypal.core.LiveEnvironment(
                  process.env.PAYPAL_CLIENT_ID,
                  process.env.PAYPAL_CLIENT_SECRET
              )
            : new paypal.core.SandboxEnvironment(
                  process.env.PAYPAL_CLIENT_ID,
                  process.env.PAYPAL_CLIENT_SECRET
              );

    return new paypal.core.PayPalHttpClient(environment);
}

const client = configurePayPalClient();

// Crear un plan de suscripción en PayPal
const createSubscriptionPlan = async (planData) => {
    const request = new paypal.billing.PlansCreateRequest();
    request.requestBody(planData);

    try {
        const response = await client.execute(request);
        return response.result;
    } catch (error) {
        throw error;
    }
};

// Crear un acuerdo de suscripción en PayPal
const createSubscriptionAgreement = async (agreementData) => {
    const request = new paypal.billing.SubscriptionsCreateRequest();
    request.requestBody(agreementData);

    try {
        const response = await client.execute(request);
        return response.result;
    } catch (error) {
        throw error;
    }
};

module.exports = { createSubscriptionPlan, createSubscriptionAgreement };