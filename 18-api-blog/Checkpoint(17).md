## ✅ Estructura completa del proyecto GitOps

```
/k8s
├── base
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── kustomization.yaml
├── overlays
│   ├── staging
│   │   ├── kustomization.yaml
│   │   └── patch-env.yaml
│   └── production
│       ├── kustomization.yaml
│       └── patch-env.yaml
├── argocd-apps
│   └── blog-api.yaml
/charts
└── blog-api
    ├── Chart.yaml
    ├── values.yaml
    └── templates
        ├── deployment.yaml
        ├── service.yaml
        └── ingress.yaml
```

---

## 📁 `/k8s/base/deployment.yaml`

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
          image: youruser/blog-api:latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: production
```

## 📁 `/k8s/base/service.yaml`

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

## 📁 `/k8s/base/ingress.yaml`

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: blog-api
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

## 📁 `/k8s/base/kustomization.yaml`

```yaml
resources:
  - deployment.yaml
  - service.yaml
  - ingress.yaml
```

---

## 📁 `/k8s/overlays/staging/kustomization.yaml`

```yaml
resources:
  - ../../base
patchesStrategicMerge:
  - patch-env.yaml
```

## 📁 `/k8s/overlays/staging/patch-env.yaml`

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

> Cambia `staging` por `production` en el otro overlay

---

## 📁 `/k8s/argocd-apps/blog-api.yaml`

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: blog-api
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/youruser/yourrepo.git
    targetRevision: main
    path: k8s/overlays/staging
  destination:
    server: https://kubernetes.default.svc
    namespace: blog
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

---

## 📁 `/charts/blog-api/Chart.yaml`

```yaml
apiVersion: v2
name: blog-api
version: 0.1.0
description: Blog API backend
```

## 📁 `/charts/blog-api/values.yaml`

```yaml
replicaCount: 2
image:
  repository: youruser/blog-api
  tag: latest
env:
  - name: JWT_SECRET
    value: changeme
```

## 📁 `/charts/blog-api/templates/deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Chart.Name }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: {{ .Chart.Name }}
  template:
    metadata:
      labels:
        app: {{ .Chart.Name }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: {{ .Values.image.repository }}:{{ .Values.image.tag }}
          ports:
            - containerPort: 3000
          env:
            {{- toYaml .Values.env | nindent 12 }}
```

---

## 🚀 ¿Qué hacer ahora?

1. 🚀 Subir esta estructura a tu repo
2. ✅ Apuntar tu `argocd` app a `/k8s/overlays/staging`
3. 📦 Usar `kustomize build` o `helm template` para probar antes de aplicar

---

