## ✅ Checkpoint: Módulo de Comentarios

---

### 🧱 Estructura: `/api/v1/comments/`

```
/comments
  controller.js
  service.js
  routes.js
  model.js
  validator.js
```

---

## 🧩 Paso 1: Modelo `Comment`

📄 `/api/v1/comments/model.js`

```js
const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');

const Comment = sequelize.define('Comment', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'comments',
  timestamps: false
});

module.exports = Comment;
```

---

## ✅ Paso 2: Validador

📄 `/api/v1/comments/validator.js`

```js
const Joi = require('joi');

exports.schemas = {
  create: Joi.object({
    content: Joi.string().required(),
    postId: Joi.number().integer().required()
  })
};
```

---

## ⚙️ Paso 3: Servicio

📄 `/api/v1/comments/service.js`

```js
const Comment = require('./model');
const Post = require('../posts/model');

exports.createComment = async (content, postId, userId) => {
  const postExists = await Post.findByPk(postId);
  if (!postExists) throw new Error('El post no existe');

  return Comment.create({ content, postId, userId });
};

exports.getCommentsByPost = async (postId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await Comment.findAndCountAll({
    where: { postId },
    offset,
    limit,
    order: [['createdAt', 'DESC']]
  });

  return {
    total: count,
    page,
    pages: Math.ceil(count / limit),
    comments: rows
  };
};
```

---

## 🎯 Paso 4: Controlador

📄 `/api/v1/comments/controller.js`

```js
const service = require('./service');

exports.create = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const comment = await service.createComment(content, postId, req.user.id);
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const result = await service.getCommentsByPost(postId, Number(page), Number(limit));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

---

## 🚦 Paso 5: Rutas

📄 `/api/v1/comments/routes.js`

```js
const express = require('express');
const router = express.Router();
const controller = require('./controller');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validator');
const { schemas } = require('./validator');

router.post('/', auth(), validate(schemas.create), controller.create);
router.get('/:postId', controller.getByPost);

module.exports = router;
```

---

## 🧩 Paso 6: Registrar rutas

📄 En `app.js`:

```js
app.use('/api/v1/comments', require('./api/v1/comments/routes'));
```

---

## 🧪 Uso de la API

**Crear comentario**

* `POST /api/v1/comments`
* Headers: `Authorization: Bearer <jwt>`
* Body JSON:

```json
{
  "postId": 1,
  "content": "Muy buen post, gracias!"
}
```

**Obtener comentarios de un post**

* `GET /api/v1/comments/1?page=1&limit=5`

---
