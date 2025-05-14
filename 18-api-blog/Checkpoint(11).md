## ✅ Checkpoint: Docker multi-stage + Kubernetes

---

## 🐳 Parte 1: Dockerfile optimizado (multi-stage)

📄 Crea `Dockerfile` en la raíz del proyecto:

```Dockerfile
# Etapa 1: build de dependencias (para producción)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

# Etapa 2: imagen final ligera
FROM node:20-alpine
WORKDIR /app

# Solo copiamos lo necesario
COPY --from=builder /app /app

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "src/server.js"]
```

> ⚠️ Asegúrate de que `server.js` sea tu punto de entrada que carga `app.js` y hace `listen(port)`.

---

### 🗂️ server.js mínimo:

```js
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API corriendo en el puerto ${PORT}`);
});
```

---

## 📦 Parte 2: Archivos Kubernetes (YAMLs)

### 📁 Estructura recomendada

```
/k8s
  deployment.yaml
  service.yaml
  ingress.yaml
```

---

### 📄 `k8s/deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: blog-api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: blog-api
  template:
    metadata:
      labels:
        app: blog-api
    spec:
      containers:
        - name: blog-api
          image: your-dockerhub-username/blog-api:latest
          ports:
            - containerPort: 3000
          envFrom:
            - secretRef:
                name: blog-api-env
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 15
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
```

---

### 📄 `k8s/service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: blog-api
spec:
  selector:
    app: blog-api
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP
```

---

### 📄 `k8s/ingress.yaml` (usando Ingress Controller)

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: blog-api-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: blog.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: blog-api
                port:
                  number: 80
```

---

## ❤️ Parte 3: Endpoint de health check

📄 Agrega en `app.js`:

```js
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
```

---

## 🚀 Parte 4: Build y push de imagen

```bash
docker build -t your-dockerhub-username/blog-api:latest .
docker push your-dockerhub-username/blog-api:latest
```

---

## ⛴️ Parte 5: Desplegar en Kubernetes

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

---

## 🧪 Test final

Agrega a tu archivo `/etc/hosts`:

```
127.0.0.1 blog.local
```

Visita en el navegador o Postman:

```
http://blog.local/api/v1/posts
```

---

¿Quieres ahora agregar el archivo `k8s/secret.yaml` para variables de entorno seguras o prefieres integrar **logging estructurado JSON con Winston** como siguiente checkpoint?
