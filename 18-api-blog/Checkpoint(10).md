## ✅ Checkpoint: Pruebas para el módulo de Comentarios

---

### 📁 Archivo: `/tests/v1/comments/comment.test.js`

```js
const request = require('supertest');
const app = require('../../../src/app');
const sequelize = require('../../../src/config/db');

let token;
let postId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Registrar usuario
  await request(app).post('/api/v1/users/register').send({
    username: 'commentuser',
    email: 'comment@example.com',
    password: 'password123'
  });

  const loginRes = await request(app).post('/api/v1/users/login').send({
    email: 'comment@example.com',
    password: 'password123'
  });

  token = loginRes.body.token;

  // Crear un post
  const postRes = await request(app)
    .post('/api/v1/posts')
    .set('Authorization', `Bearer ${token}`)
    .field('title', 'Post con comentarios')
    .field('content', 'Este post recibirá comentarios');

  postId = postRes.body.id;
});
```

---

### 🧪 Test 1: Crear comentario válido

```js
describe('Comments API', () => {
  it('should create a comment on a post', async () => {
    const res = await request(app)
      .post('/api/v1/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Buen post!',
        postId
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('content', 'Buen post!');
    expect(res.body).toHaveProperty('postId', postId);
  });
```

---

### 🧪 Test 2: Error al comentar post inexistente

```js
  it('should fail when post does not exist', async () => {
    const res = await request(app)
      .post('/api/v1/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Esto no debería funcionar',
        postId: 9999
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/no existe/i);
  });
```

---

### 🧪 Test 3: Obtener comentarios de un post

```js
  it('should get comments for a post', async () => {
    const res = await request(app).get(`/api/v1/comments/${postId}?page=1&limit=10`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.comments)).toBe(true);
    expect(res.body.total).toBeGreaterThan(0);
  });
});
```

---

### ▶️ Ejecutar pruebas

```bash
npm test
```

Ahora deberías tener 100% funcionalidad cubierta para:

* 👤 Users
* 📝 Posts
* 💬 Comments

Y un coverage general que se acerca o supera el **80% objetivo** 🎯

---

### 🛠️ Siguientes opciones posibles:

* Mock de AWS S3 en tests
* Tests de controladores de error
* Dockerizado para CI/CD
* **Docker multi-stage + Kubernetes**

¿Quieres que avancemos con el siguiente checkpoint de **Docker optimizado + Kubernetes** para contenerización y despliegue?
