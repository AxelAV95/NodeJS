## ✅ Checkpoint: Canary + Validación automática (Webhook/Prometheus)

---

## 🎯 Objetivo

El rollout se pausa en el 25%, lanza una validación (webhook o query Prometheus). Si pasa ✅, continúa. Si falla ❌, **rollback automático**.

---

## 🧱 Estructura

```
/k8s/base
  rollout.yaml
  service.yaml
  ingress.yaml
  analysis-template.yaml
  kustomization.yaml
```

---

## 📄 1. `analysis-template.yaml` – con webhook (simulado)

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
          url: http://blog-api/health
```

> El endpoint `/health` debe responder:

```json
{ "status": "healthy" }
```

---

## 📄 2. `rollout.yaml` – canary + análisis

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
    canary:
      steps:
        - setWeight: 25
        - pause: { duration: 30s }
        - analysis:
            templates:
              - templateName: rollout-health-check
        - setWeight: 50
        - pause: { duration: 30s }
        - setWeight: 100
```

---

## 📄 3. `kustomization.yaml`

```yaml
resources:
  - rollout.yaml
  - service.yaml
  - ingress.yaml
  - analysis-template.yaml
```

---

## 🚦 ¿Qué ocurre durante el rollout?

1. Se despliega nueva imagen al 25% del tráfico
2. Se ejecuta el análisis (`/health`)
3. Si la respuesta es:

   * `{ "status": "healthy" }` ✅ → continúa
   * `{ "status": "unhealthy" }` ❌ → rollback automático
4. Puedes ver todo esto gráficamente en ArgoCD UI

---

## 🔬 ¿Y si usas Prometheus?

Cambia `provider` a:

```yaml
provider:
  prometheus:
    address: http://prometheus.kube-system:9090
    query: |
      sum(rate(http_requests_total{status=~"5.."}[5m])) < 1
```

> También puedes validar CPU, errores HTTP, latencia, etc.

---

## ✅ Resultado

* Canary 25-50-100%
* Validación automática
* Rollback seguro si falla
* Observabilidad completa desde ArgoCD

---

