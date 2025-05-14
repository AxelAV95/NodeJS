## ✅ Checkpoint: Argo Rollouts – Blue/Green Deployment

---

### 📂 Estructura

```
/k8s/base
  rollout-bg.yaml
  service.yaml
  ingress.yaml
  analysis-template.yaml
  kustomization.yaml
```

---

## 📄 1. `rollout-bg.yaml`

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: blog-api
spec:
  replicas: 3
  revisionHistoryLimit: 2
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
          image: youruser/blog-api:latest
          ports:
            - containerPort: 3000
  strategy:
    blueGreen:
      activeService: blog-api
      previewService: blog-api-preview
      autoPromotionEnabled: false
      prePromotionAnalysis:
        templates:
          - templateName: rollout-health-check
```

> 🟩 `autoPromotionEnabled: false` → espera aprobación manual (opcional)

---

## 📄 2. `service.yaml` (activo y preview)

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: blog-api
spec:
  selector:
    app: blog-api
  ports:
    - port: 80
      targetPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: blog-api-preview
spec:
  selector:
    app: blog-api
  ports:
    - port: 80
      targetPort: 3000
```

> Ambos usan el mismo selector (`app: blog-api`) pero apuntan a distintas réplicas internamente según Argo Rollouts.

---

## 📄 3. `analysis-template.yaml`

Reutilizamos el de antes:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: rollout-health-check
spec:
  metrics:
    - name: health-check-webhook
      interval: 30s
      successCondition: result.status == "healthy"
      failureCondition: result.status == "unhealthy"
      provider:
        webhook:
          url: http://blog-api-preview/health
```

---

## 📄 4. `kustomization.yaml`

```yaml
resources:
  - rollout-bg.yaml
  - service.yaml
  - ingress.yaml
  - analysis-template.yaml
```

---

## 🧪 ¿Qué sucede?

1. Rollout crea dos versiones: blue (actual) y green (nueva)
2. Green es accesible solo vía `blog-api-preview`
3. Se ejecuta análisis automático o validación manual
4. Si pasa ✅ → puedes promover green con:

```bash
kubectl argo rollouts promote blog-api
```

5. Si falla ❌ → Argo vuelve a blue automáticamente

---

## 🧠 ¿Cuándo usar Blue/Green vs Canary?

| Característica        | Blue/Green        | Canary               |
| --------------------- | ----------------- | -------------------- |
| Simplicidad visual    | ✅ Alta            | ⚠️ Moderada          |
| Requiere tráfico real | ❌ No              | ✅ Sí                 |
| Validación previa     | ✅ Preview visible | ⚠️ Difícil de aislar |
| Rollback instantáneo  | ✅                 | ⚠️ Depende de paso   |

---

