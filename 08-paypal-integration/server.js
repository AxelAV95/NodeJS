const express = require('express');
const paypal = require('paypal-rest-sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());

// Configura las credenciales de PayPal
/*
En producción, configura las variables de entorno directamente en el entorno del servidor o usa un servicio 
de gestión de secretos como AWS Secrets Manager, Azure Key Vault, o similar.
*/
paypal.configure({
    'mode': process.env.PAYPAL_MODE,
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_CLIENT_SECRET
});


// Ruta para crear un pago
app.post('/create-payment', (req, res) => {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/execute-payment",
            "cancel_url": "http://localhost:3000/cancel-payment"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": "1.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "1.00"
            },
            "description": "This is the payment description."
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    // Devuelve la URL de aprobación en lugar de redirigir
                    res.json({ approval_url: payment.links[i].href });
                }
            }
        }
    });
});

// app.post('/create-payment', (req, res) => {
//   const create_payment_json = {
//     "intent": "sale",
//     "payer": {
//       "payment_method": "paypal"
//     },
//     "redirect_urls": {
//       "return_url": "http://localhost:3000/execute-payment",
//       "cancel_url": "http://localhost:3000/cancel-payment"
//     },
//     "transactions": [{
//       "item_list": {
//         "items": [{
//           "name": "item",
//           "sku": "item",
//           "price": "1.00",
//           "currency": "USD",
//           "quantity": 1
//         }]
//       },
//       "amount": {
//         "currency": "USD",
//         "total": "1.00"
//       },
//       "description": "This is the payment description."
//     }]
//   };

//   paypal.payment.create(create_payment_json, function (error, payment) {
//     if (error) {
//       throw error;
//     } else {
//       for (let i = 0; i < payment.links.length; i++) {
//         if (payment.links[i].rel === 'approval_url') {
//           res.redirect(payment.links[i].href);
//         }
//       }
//     }
//   });
// });

// Ruta para ejecutar el pago
app.get('/execute-payment', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "1.00"
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            res.send('Payment successful!');
        }
    });
});

// Ruta para manejar el pago cancelado
app.get('/cancel-payment', (req, res) => {
    res.send('Payment cancelled.');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});