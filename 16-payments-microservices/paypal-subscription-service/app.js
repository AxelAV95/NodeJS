const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const paypalSubscriptionRoutes = require('./routes/paypalSubscriptionRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3007;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/subscriptions', paypalSubscriptionRoutes);

app.listen(PORT, () => {
    console.log(`PayPal Subscription Service running on port ${PORT}`);
});