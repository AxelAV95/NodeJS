const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/payments', paymentRoutes);

app.listen(PORT, () => {
    console.log(`Payment Service running on port ${PORT}`);
});