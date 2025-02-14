const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const discountRoutes = require('./routes/discountRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/discounts', discountRoutes);

app.listen(PORT, () => {
    console.log(`Discount Service running on port ${PORT}`);
});