const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/subscriptions', subscriptionRoutes);

app.listen(PORT, () => {
    console.log(`Subscription Service running on port ${PORT}`);
});