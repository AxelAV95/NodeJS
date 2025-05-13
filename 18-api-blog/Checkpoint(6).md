## ✅ Checkpoint: Módulo de Posts con subida de imágenes (almacenamiento local)

---

### 🧱 Estructura del módulo `/api/v1/posts/`

```
/posts
  controller.js
  service.js
  routes.js
  model.js
  validator.js
  upload.js
```

---

### 📂 Paso 1: Crear carpeta para imágenes

En la raíz del proyecto:

```bash
mkdir -p uploads/posts
```

Agrega `.gitignore`:

```
uploads/
```

---

### 📦 Paso 2: Instalar multer

```bash
npm install multer
```

---

### ⚙️ Paso 3: `upload.js` – configuración de Multer

```js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/posts');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Tipo de archivo no permitido'));
};

module.exports = multer({ storage, fileFilter });
```

---

### 🧬 Paso 4: Modelo `model.js`

```js
const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');

const Post = sequelize.define('Post', {
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  imageUrl: { type: DataTypes.STRING },
  userId: { type: DataTypes.INTEGER, allowNull: false }
}, {
  timestamps: true,
  tableName: 'posts'
});

module.exports = Post;
```

---

### ✅ Paso 5: Validador `validator.js`

```js
const Joi = require('joi');

exports.schemas = {
  create: Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required()
  })
};
```

---

### ⚙️ Paso 6: Servicio `service.js`

```js
const Post = require('./model');

exports.createPost = async (data, userId, imagePath) => {
  return Post.create({
    ...data,
    userId,
    imageUrl: imagePath ? `/uploads/posts/${imagePath}` : null
  });
};

exports.getAllPosts = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const { count, rows } = await Post.findAndCountAll({
    offset,
    limit,
    order: [['createdAt', 'DESC']]
  });

  return {
    total: count,
    page,
    pages: Math.ceil(count / limit),
    posts: rows
  };
};
```

---

### 🎯 Paso 7: Controlador `controller.js`

```js
const service = require('./service');

exports.create = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await service.createPost({ title, content }, req.user.id, req.file?.filename);
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await service.getAllPosts(Number(page), Number(limit));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

---

### 🚦 Paso 8: Rutas `routes.js`

```js
const express = require('express');
const router = express.Router();
const controller = require('./controller');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validator');
const upload = require('./upload');
const { schemas } = require('./validator');

router.get('/', controller.getAll);
router.post(
  '/',
  auth(), // requiere login
  upload.single('image'),
  validate(schemas.create),
  controller.create
);

module.exports = router;
```

---

### 📥 Paso 9: Exponer archivos estáticos y registrar rutas en `app.js`

```js
const express = require('express');
const app = express();
const cors = require('./config/cors');
const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());
app.use(cors);
app.use(rateLimiter);
app.use('/uploads', express.static('uploads'));

app.use('/api/v1/users', require('./api/v1/users/routes'));
app.use('/api/v1/posts', require('./api/v1/posts/routes'));

app.use(errorHandler);

module.exports = app;
```

---

### 🧪 Ejemplo de uso

**POST** `/api/v1/posts`

* Headers: `Authorization: Bearer <jwt>`
* Form-data:

  * `title`: Mi primer post
  * `content`: Esto es el contenido.
  * `image`: (archivo)

**GET** `/api/v1/posts?page=1&limit=5`

---

### 📌 Bonus: Validación de existencia de carpeta

Agrega esto en tu `server.js` para evitar errores si no existe `uploads/posts`:

```js
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'uploads/posts');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}
```


