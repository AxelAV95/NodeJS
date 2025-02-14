const paypal = require('@paypal/checkout-server-sdk');
const dotenv = require('dotenv');

// Cargar variables de entorno
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

/**
 * Crea una orden de pago.
 * @param {Object} paymentData - Los detalles del pago (por ejemplo, monto, moneda).
 * @returns {Promise<Object>} - La orden de pago creada.
 */
const createPayment = async (paymentData) => {
    try {
        const request = new paypal.orders.OrdersCreateRequest();
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: paymentData.currency || 'USD', // Por defecto USD si no se proporciona
                        value: paymentData.amount.toString(), // Asegúrate de que el monto sea una cadena
                    },
                },
            ],
            application_context: {
                return_url: 'http://localhost:3004/payments/execute',  // Cambia a tu URL real
                cancel_url: 'http://localhost:3004/payments/cancel',   // Cambia a tu URL real
            },
        });

        const response = await client.execute(request);
        return response.result;
    } catch (error) {
        throw error;
    }
};

// const createPayment = async (paymentData) => {
//     try {
//         const request = new paypal.orders.OrdersCreateRequest();
//         request.requestBody({
//             intent: 'CAPTURE',
//             purchase_units: [
//                 {
//                     amount: {
//                         currency_code: paymentData.currency || 'USD', // Por defecto USD si no se proporciona
//                         value: paymentData.amount.toString(), // Asegúrate de que el monto sea una cadena
//                     },
//                 },
//             ],
//         });

//         const response = await client.execute(request);
//         return response.result;
//     } catch (error) {
//         throw error;
//     }
// };

/**
 * Ejecuta un pago capturando una orden.
 * @param {string} orderId - El ID de la orden a capturar.
 * @returns {Promise<Object>} - Los detalles del pago capturado.
 */


const executePayment = async (orderId) => {
    try {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});
        const response = await client.execute(request);
        return response.result;
    } catch (error) {
        throw error;
    }
};

module.exports = { createPayment, executePayment };