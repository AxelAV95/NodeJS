## ✅ Checkpoint: Pruebas para el módulo de Posts

---

### 📁 Archivo: `/tests/v1/posts/post.test.js`

```js
const request = require('supertest');
const app = require('../../../src/app');
const sequelize = require('../../../src/config/db');

let token;

beforeAll(async () => {
  // Limpia la base de datos y sincroniza modelos
  await sequelize.sync({ force: true });

  // Registra un usuario y obtiene token
  const userRes = await request(app).post('/api/v1/users/register').send({
    username: 'postuser',
    email: 'postuser@example.com',
    password: 'password123'
  });

  const loginRes = await request(app).post('/api/v1/users/login').send({
    email: 'postuser@example.com',
    password: 'password123'
  });

  token = loginRes.body.token;
});
```

---

### 🧪 Test 1: Crear un post válido

```js
describe('Posts API', () => {
  it('should create a post', async () => {
    const res = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Mi primer post')
      .field('content', 'Este es un contenido genial');

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('title', 'Mi primer post');
    expect(res.body).toHaveProperty('userId');
  });
```

---

### 🧪 Test 2: Falla al crear sin token

```js
  it('should fail to create a post without token', async () => {
    const res = await request(app)
      .post('/api/v1/posts')
      .send({ title: 'Sin auth', content: 'No debería pasar' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
```

---

### 🧪 Test 3: Obtener posts con paginación

```js
  it('should get a list of posts', async () => {
    const res = await request(app).get('/api/v1/posts?page=1&limit=10');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('posts');
    expect(Array.isArray(res.body.posts)).toBe(true);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
  });
});
```

---

### ▶️ Ejecutar pruebas

```bash
npm test
```

Deberías ver algo como:

```
PASS  tests/v1/posts/post.test.js
PASS  tests/v1/users/user.test.js
Test Suites: 2 passed, 2 total
Tests:       5 passed, 5 total
Coverage:    ~80-90% en users y posts
```

---

## 📌 Próximos pasos posibles

* ✅ Testear **comentarios**
* 🧪 Incluir **tests con imágenes** (usando mocks o fakes)
* 🧪 Simular errores (fallas de base de datos, inputs inválidos)
* 🧪 Medir **coverage por módulo**

---

¿Te gustaría que sigamos ahora con las pruebas del módulo de **comentarios**, o prefieres configurar ya el entorno de **Docker multi-stage y Kubernetes**?
