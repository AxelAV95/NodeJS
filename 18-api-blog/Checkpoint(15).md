## ✅ Checkpoint: Despliegue GitOps con ArgoCD

---

### 🎯 ¿Qué vas a lograr?

* Tu repositorio Git es la fuente de verdad del despliegue
* ArgoCD sincroniza automáticamente tu app (o manualmente, si prefieres)
* Puedes ver el estado de la app, eventos y rollbacks en una interfaz web

---

## 🧱 Paso 1: Estructura del repositorio para ArgoCD

ArgoCD necesita acceso a los manifiestos `YAML`. Puedes estructurar así:

```
/k8s
  /overlays
    /production
      kustomization.yaml
      deployment.yaml
      service.yaml
      ingress.yaml
    /staging
      ...
```

O simplemente:

```
/k8s
  app.yaml
  deployment.yaml
  service.yaml
  ingress.yaml
```

---

## 🧩 Paso 2: Crear recurso `Application` de ArgoCD

Este es el objeto que representa tu app en ArgoCD.

📄 Crea: `/k8s/argocd-app.yaml`

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: blog-api
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/<TU_USUARIO>/<TU_REPO>.git
    targetRevision: main
    path: k8s
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

> 🔐 Reemplaza `<TU_USUARIO>/<TU_REPO>` con tu GitHub

---

## ⚙️ Paso 3: Instalar ArgoCD (una vez por clúster)

Si no tienes ArgoCD aún:

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Accede vía port-forward:

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Visita: [http://localhost:8080](http://localhost:8080)
Login: usuario `admin`, contraseña inicial:

```bash
kubectl get secret argocd-initial-admin-secret -n argocd -o jsonpath="{.data.password}" | base64 -d
```

---

## 🚀 Paso 4: Aplicar tu `Application`

```bash
kubectl apply -f k8s/argocd-app.yaml
```

ArgoCD empezará a sincronizar automáticamente tu app del repo hacia Kubernetes.

---

## 📌 Resultado

* Cada `git push` con cambios en `/k8s/` dispara un sync (si `automated`)
* Puedes ver visualmente pods, estado, errores y diffs en UI ArgoCD
* Git es tu "fuente de verdad" (GitOps completo)

---

## 🧪 ¿Quieres ir más allá?

* ✅ Agrega alertas via Slack/Discord con Argo Events
* ✅ Usa **Kustomize** para manejar ambientes (`staging`, `prod`)
* ✅ Agrega `helm` si quieres más control dinámico de plantillas

---

