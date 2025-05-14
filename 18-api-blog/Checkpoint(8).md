## ✅ Checkpoint: Pruebas unitarias con Jest + Supertest

---

### 📦 Paso 1: Instalar dependencias

Ya instalaste Jest y Supertest antes, pero si no lo hiciste:

```bash
npm install --save-dev jest supertest
```

Agrega esto a tu `package.json`:

```json
"scripts": {
  "test": "NODE_ENV=test jest --runInBand --coverage"
}
```

---

### 🧪 Paso 2: Configurar entorno de pruebas `.env.test`

Crea un archivo `.env.test` con una **base de datos aislada**:

```env
PORT=4000
DB_HOST=db
DB_USER=root
DB_PASSWORD=root
DB_NAME=blog_test
JWT_SECRET=testsecret
```

Asegúrate de crear `blog_test` en tu contenedor MySQL.

---

### 🧩 Paso 3: Estructura recomendada para tests

```
/tests
  /v1
    /users
      user.test.js
    /posts
      post.test.js
    /comments
      comment.test.js
```

---

### 🚀 Paso 4: Setup de prueba con base de datos

📄 `/tests/setup.js`

```js
require('dotenv').config({ path: '.env.test' });
const sequelize = require('../src/config/db');

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Limpia la DB antes de pruebas
});

afterAll(async () => {
  await sequelize.close();
});
```

Agrega en `jest.config.js`:

```js
module.exports = {
  globalSetup: './tests/setup.js',
  testEnvironment: 'node'
};
```

---

### 📄 Paso 5: Prueba básica – registro de usuario

📄 `/tests/v1/users/user.test.js`

```js
const request = require('supertest');
const app = require('../../../src/app');

describe('Users API', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/api/v1/users/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('username', 'testuser');
  });

  it('should fail to register with invalid email', async () => {
    const res = await request(app).post('/api/v1/users/register').send({
      username: 'bademail',
      email: 'invalid',
      password: 'pass123'
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toMatch(/email/i);
  });
});
```

---

### 🎯 Paso 6: Ejecutar pruebas y revisar coverage

```bash
npm test
```

Esto mostrará:

* Testes pasados/fallidos
* Coverage por archivo: `controllers`, `services`, `middlewares`, etc.

---

### 📌 Recomendaciones

* Testea **services** en aislamiento (sin request HTTP)
* Cubre flujos felices + errores
* Usa `mock` si deseas simular llamadas a Redis o AWS

---

### ⏭️ ¿Siguiente paso?

Podemos:

1. Agregar pruebas para **posts y comentarios**
2. Configurar **Docker para entorno de testing automatizado**
3. Integrar con **CI/CD (GitHub Actions)**


