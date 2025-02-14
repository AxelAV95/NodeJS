const express = require('express');
const sequelize = require('./config/db');
const usuarioRoutes = require('./routes/usuarioRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Sincroniza el modelo con la base de datos
sequelize.sync().then(() => {
    console.log('Base de datos sincronizada');
});

// Rutas
app.use('/usuarios', usuarioRoutes);

// Manejo de errores
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});