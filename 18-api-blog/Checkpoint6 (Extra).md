Perfecto. Vamos con el **Checkpoint para subir imágenes a AWS S3** desde tu API de Posts, como una alternativa (o complemento) al almacenamiento local. Usaremos el SDK oficial de AWS y Multer-S3 para manejar la subida directamente a un bucket.

---

## ✅ Checkpoint Extra: Subida de imágenes a **AWS S3**

---

### 📦 Paso 1: Instalar dependencias necesarias

```bash
npm install aws-sdk multer-s3
```

---

### 🧾 Paso 2: Variables de entorno necesarias

Agrega a tu archivo `.env`:

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your_bucket_name
```

---

### 🧠 Paso 3: Configuración de AWS SDK

Crea el archivo: `/config/s3.js`

```js
const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

module.exports = s3;
```

---

### 🧩 Paso 4: Multer configurado para S3

Crea una versión alternativa de `upload.js`: `/api/v1/posts/upload.s3.js`

```js
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../../../config/s3');
const path = require('path');

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `posts/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, filename);
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Tipo de archivo no permitido'));
  }
});

module.exports = upload;
```

---

### ✍️ Paso 5: Modificar el servicio de Posts para guardar la URL pública de S3

En `/api/v1/posts/service.js`:

```js
exports.createPost = async (data, userId, imageUrl) => {
  return Post.create({
    ...data,
    userId,
    imageUrl: imageUrl || null
  });
};
```

En el controlador `/api/v1/posts/controller.js`, ajusta `create`:

```js
exports.create = async (req, res) => {
  try {
    const { title, content } = req.body;
    const imageUrl = req.file?.location; // S3 retorna .location con la URL completa
    const post = await service.createPost({ title, content }, req.user.id, imageUrl);
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

---

### 🔀 Paso 6: Alternar entre local y S3

Puedes usar una variable en `.env` para decidir qué sistema usar:

```env
UPLOAD_DRIVER=s3
```

Y en `/api/v1/posts/routes.js`:

```js
const uploadDriver = process.env.UPLOAD_DRIVER === 's3'
  ? require('./upload.s3')
  : require('./upload');

router.post(
  '/',
  auth(),
  uploadDriver.single('image'),
  validate(schemas.create),
  controller.create
);
```

---

### ✅ Resultado

Tu API ahora puede:

* Subir imágenes directamente a S3
* Obtener URL pública
* Guardarla en la base de datos
* Alternar entre almacenamiento local y en la nube con una sola variable

---

Perfecto. Vamos a mejorar la seguridad y la experiencia del usuario agregando una **verificación de tipo y tamaño de archivo** antes de subir imágenes a S3.

Esto previene ataques y errores comunes (como subir archivos no válidos o demasiado grandes).

---

## ✅ Mejoras a la subida a S3: tipo y tamaño de archivo

---

### 📁 Archivo: `/api/v1/posts/upload.s3.js` (actualizado)

Agrega la verificación del tamaño y tipo MIME justo en la configuración de `multer`.

```js
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const s3 = require('../../../config/s3');

const MAX_SIZE_MB = 5;

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `posts/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, filename);
    }
  }),
  limits: {
    fileSize: MAX_SIZE_MB * 1024 * 1024 // e.g. 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Solo se permiten imágenes JPG o PNG'));
    }
    cb(null, true);
  }
});

module.exports = upload;
```

---

### 🛡️ Extra: Manejo de errores de subida en el controlador

Actualiza el `controller.js` para atrapar errores específicos de `multer`:

```js
exports.create = async (req, res) => {
  try {
    const { title, content } = req.body;
    const imageUrl = req.file?.location;
    const post = await service.createPost({ title, content }, req.user.id, imageUrl);
    res.status(201).json(post);
  } catch (err) {
    // Manejo explícito de errores de Multer
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Error al subir archivo: ${err.message}` });
    }
    res.status(500).json({ error: err.message });
  }
};
```

> 📌 También puedes aplicar esta validación en el almacenamiento local, si decides mantener ambas opciones disponibles.

---

Con esto, se asegura que:

* Solo imágenes `JPG` y `PNG` sean aceptadas
* El tamaño no supere los **5 MB**
* Se informe claramente al usuario en caso de error

---




