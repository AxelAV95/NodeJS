## ✅ Checkpoint: Plantilla base de Argo Rollouts (Canary Deployment)

---

### 📦 ¿Qué es necesario?

1. Instalar el **controlador de Argo Rollouts**
2. Reemplazar tus `Deployment` por un `Rollout`
3. Usar un `Service` estable
4. Integrar con ArgoCD para visualizar

---

## 🧱 Paso 1: Instalar Argo Rollouts Controller (si aún no lo tienes)

```bash
kubectl create namespace argo-rollouts
kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml
```

---

## 📂 Estructura recomendada para rollout

```
/k8s/base/
  rollout.yaml
  service.yaml
  ingress.yaml
  kustomization.yaml
```

> Reemplaza `deployment.yaml` con `rollout.yaml`

---

## 📄 `/k8s/base/rollout.yaml`

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
          env:
            - name: NODE_ENV
              value: production
  strategy:
    canary:
      steps:
        - setWeight: 25
        - pause: { duration: 30s }
        - setWeight: 50
        - pause: { duration: 30s }
        - setWeight: 100
```

---

## 📄 `/k8s/base/service.yaml`

```yaml
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
```

---

## 📄 `/k8s/base/kustomization.yaml`

```yaml
resources:
  - rollout.yaml
  - service.yaml
  - ingress.yaml
```

---

## ▶️ Paso 2: Activar soporte para Rollouts en ArgoCD

📄 Agrega a tu `argocd-cm` config map (en cluster):

```yaml
data:
  resource.customizations.health.argoproj.io/Rollout: |
    hs = {}
    if obj.status ~= nil then
      if obj.status.pauseConditions ~= nil then
        hs.status = "Degraded"
        hs.message = "Paused"
        return hs
      end
      if obj.status.readyReplicas ~= nil and obj.status.readyReplicas == obj.spec.replicas then
        hs.status = "Healthy"
        return hs
      end
    end
    hs.status = "Progressing"
    return hs
```

O simplemente:

```bash
kubectl edit configmap argocd-cm -n argocd
```

Reinicia el pod de ArgoCD:

```bash
kubectl rollout restart deployment argocd-server -n argocd
```

---

## 🧪 Paso 3: Ver en la UI

1. Entra a ArgoCD
2. Verás tipo `Rollout` en vez de `Deployment`
3. Puedes **ver gráficamente el progreso del canary**

---

## 🧩 Siguiente nivel (opcional)

* Agrega `analysisTemplates` para validaciones automáticas
* Usa un `previewService` para inspeccionar tráfico canario
* Automatiza con webhooks (Slack, Prometheus, etc.)

---
