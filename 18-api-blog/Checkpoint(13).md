## ✅ Checkpoint: Logging estructurado con Winston

---

### 📦 Paso 1: Instalar Winston

Ya deberías tenerlo instalado, pero si no:

```bash
npm install winston
```

---

### 📁 Paso 2: Crear logger

📄 Archivo: `/config/logger.js`

```js
const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console(), // Muestra en consola (útil en contenedores)
    // Puedes agregar archivos si lo deseas:
    // new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new transports.File({ filename: 'logs/combined.log' })
  ]
});

module.exports = logger;
```

---

### 🧠 Paso 3: Usar el logger globalmente

#### 📄 En `server.js`:

```js
const logger = require('./src/config/logger');

// ...

app.listen(PORT, () => {
  logger.info(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
```

---

#### 📄 En middlewares y controladores:

📄 `/middlewares/errorHandler.js`

```js
const logger = require('../config/logger');

module.exports = (err, req, res, next) => {
  logger.error('Error manejado:', {
    message: err.message,
    stack: err.stack,
    route: req.originalUrl,
    method: req.method
  });

  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(status).json({ error: { message, status } });
};
```

📄 En un controlador (`posts`, por ejemplo):

```js
const logger = require('../../config/logger');

exports.create = async (req, res) => {
  try {
    // ...
    logger.info('Nuevo post creado', { userId: req.user.id, title: req.body.title });
    res.status(201).json(post);
  } catch (err) {
    logger.warn('Error al crear post', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};
```

---

### ✅ Resultado

Tus logs ahora:

* 📦 Son legibles por humanos y máquinas (JSON)
* 📚 Incluyen `timestamp`, `stack trace`, `method`, `route`, etc.
* 🧹 Son centralizables (Kubernetes puede exportarlos con Fluent Bit, Loki, etc.)

---

### 🧪 Ejemplo de log generado

```json
{
  "level": "info",
  "message": "Nuevo post creado",
  "userId": 1,
  "title": "Post de ejemplo",
  "timestamp": "2025-05-13T20:31:12.303Z"
}
```

