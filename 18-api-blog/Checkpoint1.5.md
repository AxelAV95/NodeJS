## ✅ Checkpoint 1.1: MySQL + Redis + phpMyAdmin en Docker

---

### 📁 Estructura:

```
/docker
  └─ mysql
      └─ my.cnf
docker-compose.yml
.env
```

---

### 🔁 `docker-compose.yml` completo

```yaml
version: '3.8'

services:
  db:
    image: mysql:8.0
    container_name: blog-db
    restart: always
    environment:
      MYSQL_DATABASE: blog
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - db_data:/var/lib/mysql
      - ./docker/mysql/my.cnf:/etc/mysql/my.cnf
    ports:
      - "3306:3306"
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    container_name: blog-phpmyadmin
    restart: always
    environment:
      PMA_HOST: db
      PMA_PORT: 3306
    ports:
      - "8080:80"
    depends_on:
      - db

  redis:
    image: redis:7
    container_name: blog-redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  db_data:
  redis_data:
```

---

### ⚙️ Configuración MySQL personalizada `docker/mysql/my.cnf`

```cnf
[mysqld]
sql_mode=STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION
```

---

### 🌐 Archivo `.env`

Asegúrate de tener:

```env
DB_HOST=db
DB_USER=root
DB_PASSWORD=root
DB_NAME=blog

REDIS_URL=redis://blog-redis:6379
```

---

### 🔌 Conexión a Redis desde Node.js `/config/redis.js`

```js
const { createClient } = require('redis');
require('dotenv').config();

const client = createClient({ url: process.env.REDIS_URL });

client.on('error', (err) => console.error('Redis Client Error', err));

client.connect();

module.exports = client;
```

---

### ▶️ Ejecutar todos los servicios

```bash
docker compose up -d
```

Verifica los contenedores:

```bash
docker ps
```

---

### 🔍 Acceder a phpMyAdmin

Visita: [http://localhost:8080](http://localhost:8080)

* **Servidor**: `db`
* **Usuario**: `root`
* **Contraseña**: `root`

Ya puedes ejecutar comandos SQL, importar/exportar, y administrar la base de datos.


