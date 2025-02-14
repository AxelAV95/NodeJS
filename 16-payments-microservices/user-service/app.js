const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/users', userRoutes);

app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`);
});