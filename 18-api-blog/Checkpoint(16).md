## ✅ Parte 1: Argo Events + Notificaciones (Slack / Discord)

---

### 📌 ¿Qué es Argo Events?

Es un sistema que permite **reaccionar a eventos** dentro y fuera del clúster, como:

* Un nuevo `Application` falló
* Un `sync` automático fue exitoso
* Puedes enviar notificaciones, disparar pipelines, etc.

---

### 🧱 Paso 1: Instalar Argo Events + Argo Notifications

```bash
kubectl create namespace argo-events

kubectl apply -n argo-events -f https://raw.githubusercontent.com/argoproj/argo-events/stable/manifests/install.yaml

kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/notifications/install.yaml
```

---

### ⚙️ Paso 2: Configurar canal de Slack (o Discord)

📄 Crear `ConfigMap` `argocd-notifications-cm`

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-notifications-cm
  namespace: argocd
data:
  service.slack: |
    token: $slack-token
  template.app-sync-status: |
    message: |
      ✅ ArgoCD App {{.app.metadata.name}} synced to {{.app.status.sync.status}}.
  trigger.on-sync: |
    - when: app.status.operationState.phase in ['Succeeded']
      send: [app-sync-status]
```

📄 Secret con token:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: argocd-notifications-secret
  namespace: argocd
stringData:
  slack-token: <SLACK_BOT_TOKEN>
```

Para Discord, puedes usar un `webhook` y `service.webhook.discord`.

---

## ✅ Parte 2: Kustomize para ambientes

---

### 📂 Estructura recomendada

```
/k8s
  /base
    deployment.yaml
    service.yaml
    ingress.yaml
    kustomization.yaml
  /overlays
    /staging
      kustomization.yaml
      patch-env.yaml
    /production
      kustomization.yaml
      patch-env.yaml
```

📄 `base/kustomization.yaml`

```yaml
resources:
  - deployment.yaml
  - service.yaml
  - ingress.yaml
```

📄 `overlays/staging/kustomization.yaml`

```yaml
resources:
  - ../../base
patchesStrategicMerge:
  - patch-env.yaml
```

📄 `patch-env.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: blog-api
spec:
  template:
    spec:
      containers:
        - name: blog-api
          env:
            - name: NODE_ENV
              value: staging
```

Luego en ArgoCD `Application` usas:

```yaml
  source:
    path: k8s/overlays/staging
```

---

## ✅ Parte 3: Helm para parametrización total

---

### 🧱 Paso 1: Crear Helm Chart

```bash
helm create blog-api
```

Esto te genera:

```
/charts/blog-api/
  Chart.yaml
  values.yaml
  templates/
```

💡 Mueve tus `deployment.yaml`, `service.yaml`, etc. a `templates/`, y convierte cosas como:

```yaml
replicas: {{ .Values.replicaCount }}
```

📄 `values.yaml` mínimo:

```yaml
replicaCount: 2
image:
  repository: youruser/blog-api
  tag: latest
env:
  - name: JWT_SECRET
    value: supersecret
```

---

### ⚙️ Paso 2: Usar Helm en ArgoCD

```yaml
source:
  repoURL: https://github.com/your/repo.git
  targetRevision: main
  path: charts/blog-api
  helm:
    valueFiles:
      - values.yaml
```

Puedes usar `values-prod.yaml`, `values-staging.yaml`, etc. también.

---

## 🚀 Resultado final

* ✅ CI/CD con tests y build automático
* ✅ Deploy GitOps puro vía ArgoCD
* ✅ Ambientes separados (`staging`, `prod`) con Kustomize
* ✅ Control dinámico con Helm
* ✅ Notificaciones a Slack/Discord con Argo Events

---
