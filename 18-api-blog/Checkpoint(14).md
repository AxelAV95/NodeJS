## ✅ Checkpoint: CI/CD con GitHub Actions

---

### 🎯 Objetivo

1. Ejecutar tests en cada push
2. Generar build Docker
3. Subir imagen a Docker Hub (opcional)
4. \[Opcional] Desplegar a Kubernetes vía `kubectl` o ArgoCD

---

## 🗂️ Paso 1: Estructura del workflow

📄 Crea: `.github/workflows/ci-cd.yml`

```yaml
name: CI/CD Blog API

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: blog_test
        ports:
          - 3306:3306
        options: >-
          --health-cmd="mysqladmin ping --silent"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3

    steps:
      - name: Checkout código
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Instalar dependencias
        run: npm install

      - name: Esperar a MySQL
        run: |
          until mysqladmin ping -h"127.0.0.1" --silent; do
            echo "Esperando a MySQL..."
            sleep 5
          done

      - name: Crear archivo .env.test
        run: |
          echo "DB_HOST=127.0.0.1" >> .env.test
          echo "DB_USER=root" >> .env.test
          echo "DB_PASSWORD=root" >> .env.test
          echo "DB_NAME=blog_test" >> .env.test
          echo "JWT_SECRET=testsecret" >> .env.test
          echo "REDIS_URL=redis://localhost:6379" >> .env.test
          echo "UPLOAD_DRIVER=local" >> .env.test

      - name: Ejecutar tests
        run: npm test
```

---

## 🧪 Resultado

Cada vez que haces **push a `main`** o un **pull request**, GitHub:

* Instala dependencias
* Levanta MySQL de prueba
* Crea `.env.test`
* Ejecuta tus pruebas unitarias con coverage

---

## 🚀 Extra opcional: Push a Docker Hub

Agrega a `ci-cd.yml`:

```yaml
  docker-build-and-push:
    needs: build-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Login to DockerHub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker image
        run: |
          docker build -t ${{ secrets.DOCKER_USERNAME }}/blog-api:latest .
          docker push ${{ secrets.DOCKER_USERNAME }}/blog-api:latest
```

🛡️ Guarda `DOCKER_USERNAME` y `DOCKER_PASSWORD` en **GitHub > Settings > Secrets** del repo.

---

## 🧩 Siguiente nivel (opcional)

* 🎯 Usar `kubectl` + `KUBECONFIG` para hacer deploy automático a tu clúster
* 🧠 Integrar con **ArgoCD**, **Flux**, o **Terraform**

