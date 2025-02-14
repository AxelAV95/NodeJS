const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3006;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/admin', adminRoutes);

app.listen(PORT, () => {
    console.log(`Admin Service running on port ${PORT}`);
});