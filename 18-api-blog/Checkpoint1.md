## ✅ Checkpoint 1: Estructura del proyecto

**Vertical Slicing + MVC** divide por funcionalidades (slices), no por tipo de archivo. Ejemplo:

```
/src
  /api
    /v1
      /users
        controller.js
        service.js
        routes.js
        model.js
        validator.js
      /posts
      /comments
  /config
    db.js
    redis.js
    logger.js
    cors.js
  /middlewares
    auth.js
    rateLimiter.js
    errorHandler.js
    validator.js
  /utils
    jwt.js
    pagination.js
  app.js
  server.js
/tests
/docker
```

**Multi-versioning** está soportado en `/api/v1`, `/api/v2`, etc.

---

## ✅ Checkpoint 2: Inicialización del proyecto y dependencias

```bash
mkdir blog-api && cd blog-api
npm init -y
npm install express mysql2 sequelize dotenv cors jsonwebtoken express-rate-limit bcrypt joi helmet redis winston morgan
npm install --save-dev nodemon jest supertest
```

Crea un archivo `.env`:

```env
PORT=3000
DB_HOST=db
DB_USER=root
DB_PASSWORD=root
DB_NAME=blog
JWT_SECRET=supersecretkey
REDIS_URL=redis://redis:6379
```

---

## ✅ Checkpoint 3: Base de datos - MySQL con Sequelize

### SQL Inicial

```sql
CREATE DATABASE blog;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  content TEXT,
  image_url VARCHAR(255),
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT,
  post_id INT,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

En `/config/db.js`:

```js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
);

module.exports = sequelize;
```

---

## ✅ Checkpoint 4: Autenticación con JWT, Rate Limit, CORS, Seguridad

### Middlewares

#### `/middlewares/auth.js`

```js
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (roles = []) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token requerido' });

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      if (roles.length && !roles.includes(user.role)) return res.sendStatus(403);
      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Token inválido' });
    }
  };
};
```

#### `/middlewares/rateLimiter.js`

```js
const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas peticiones, intente luego.'
});
```

#### `/middlewares/cors.js`

```js
const cors = require('cors');

module.exports = cors({
  origin: '*', // Puedes limitar esto a tu frontend
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
});
```

#### Seguridad con Helmet

```js
const helmet = require('helmet');
app.use(helmet());
```

---

## ✅ Checkpoint 5: Primer módulo - Users

### `/api/v1/users/routes.js`

```js
const express = require('express');
const router = express.Router();
const controller = require('./controller');
const validate = require('../../../../middlewares/validator');

router.post('/register', validate('register'), controller.register);
router.post('/login', validate('login'), controller.login);

module.exports = router;
```

### `/api/v1/users/controller.js`

```js
const service = require('./service');

exports.register = async (req, res) => {
  const result = await service.register(req.body);
  res.status(201).json(result);
};

exports.login = async (req, res) => {
  const token = await service.login(req.body);
  res.json({ token });
};
```

### `/api/v1/users/service.js`

```js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../../config/db');
const User = require('./model');

exports.register = async ({ username, email, password }) => {
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hash });
  return { id: user.id, username: user.username };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Credenciales inválidas');
  }
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
};
```

### `/api/v1/users/validator.js`

```js
const Joi = require('joi');

exports.schemas = {
  register: Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};
```

### `/middlewares/validator.js`

```js
const { schemas } = require('../api/v1/users/validator');

module.exports = (type) => {
  return (req, res, next) => {
    const schema = schemas[type];
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
  };
};
```

---


