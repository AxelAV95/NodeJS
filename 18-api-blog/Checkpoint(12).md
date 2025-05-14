## ✅ Checkpoint: Definir y usar `secret.yaml` en Kubernetes

---

### 📁 Archivo: `/k8s/secret.yaml`

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: blog-api-env
type: Opaque
stringData:
  PORT: "3000"
  DB_HOST: "db"
  DB_USER: "root"
  DB_PASSWORD: "root"
  DB_NAME: "blog"
  JWT_SECRET: "supersecretkey"
  REDIS_URL: "redis://blog-redis:6379"
  AWS_ACCESS_KEY_ID: "your_access_key"
  AWS_SECRET_ACCESS_KEY: "your_secret"
  AWS_REGION: "us-east-1"
  AWS_BUCKET_NAME: "your_bucket"
  UPLOAD_DRIVER: "s3"
```

> 🔐 `stringData` permite escribir directamente strings legibles (se convertirá automáticamente en base64 internamente).

---

### 📌 Paso 2: Aplicar el secreto

```bash
kubectl apply -f k8s/secret.yaml
```

Verifica que se creó correctamente:

```bash
kubectl get secrets
```

---

### 🔗 Paso 3: Conectar secreto al `Deployment`

En tu `/k8s/deployment.yaml`, ya lo tenemos, pero asegúrate que esté así:

```yaml
envFrom:
  - secretRef:
      name: blog-api-env
```

Esto cargará automáticamente todas las claves como variables de entorno en el contenedor.

---

### 🧪 Test rápido

Agrega este endpoint temporal en `app.js` para verificar variables cargadas:

```js
app.get('/debug/env', (req, res) => {
  res.json({
    env: {
      db: process.env.DB_NAME,
      redis: process.env.REDIS_URL,
      upload: process.env.UPLOAD_DRIVER
    }
  });
});
```

---

## 🎯 Resultado

* ✅ Variables de entorno sensibles separadas del código y Dockerfile
* ✅ Integradas con Kubernetes vía `Secret`
* ✅ Fáciles de rotar sin rebuild del contenedor

---

