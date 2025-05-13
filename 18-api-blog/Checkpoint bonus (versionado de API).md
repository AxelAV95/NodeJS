
## ✅ Checkpoint: Versionado de API (v1, v2...)

---

### 🎯 Objetivo

Permitir coexistencia de múltiples versiones de la API:

```
/api/v1/users
/api/v1/posts
/api/v2/posts
```

---

### 🧱 Estructura recomendada

```
/src
  /api
    /v1
      /users
      /posts
      /comments
    /v2
      (vacío o con futuros módulos)
  /routes
    index.js
app.js
```

---

### 📁 Paso 1: Crear `/routes/index.js` para enrutar por versión

```js
const express = require('express');
const router = express.Router();

const v1Routes = express.Router();
v1Routes.use('/users', require('../api/v1/users/routes'));
v1Routes.use('/posts', require('../api/v1/posts/routes'));
v1Routes.use('/comments', require('../api/v1/comments/routes'));

router.use('/v1', v1Routes);

// Preparado para futuras versiones
// const v2Routes = express.Router();
// v2Routes.use('/posts', require('../api/v2/posts/routes'));
// router.use('/v2', v2Routes);

module.exports = router;
```

---

### 📄 Paso 2: Usar en `app.js`

Sustituye las líneas que registraban rutas directamente por:

```js
const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('./config/cors');
const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');

app.use(helmet());
app.use(express.json());
app.use(cors);
app.use(rateLimiter);
app.use('/uploads', express.static('uploads'));

// Versionado de rutas
app.use('/api', routes);

app.use(errorHandler);

module.exports = app;
```

---

### 🧪 Prueba rápida

Accede a tus rutas desde:

* `GET /api/v1/posts`
* `GET /api/v1/comments/:postId`
* `POST /api/v1/users/register`

Todo seguirá funcionando exactamente igual, pero ya con el sistema de versiones enrutado y listo para escalar.

---

### 🗂️ Bonus: Crear `/api/v2` como base futura

Puedes crear una nueva carpeta para v2 con rutas que hereden o reimplementen servicios:

```
/api/v2
  /posts
    controller.js
    routes.js
    service.js
```

Y en `/routes/index.js` simplemente descomentas y agregas:

```js
const v2Routes = express.Router();
v2Routes.use('/posts', require('../api/v2/posts/routes'));
router.use('/v2', v2Routes);
```

---


