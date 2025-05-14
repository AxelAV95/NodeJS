## ✅ Repositorio base: `blog-api-gitops-template`

### 🧱 Estructura del proyecto

```
/
├── .github/
│   └── workflows/
│       └── deploy-argocd.yml      # CI/CD GitHub Actions
├── k8s/
│   ├── base/
│   │   ├── rollout.yaml           # Argo Rollout (canary o blue/green)
│   │   ├── service.yaml
│   │   ├── ingress.yaml
│   │   ├── analysis-template.yaml
│   │   └── kustomization.yaml
│   ├── overlays/
│   │   ├── staging/
│   │   │   ├── kustomization.yaml
│   │   │   └── patch-env.yaml
│   │   └── production/
│   │       ├── kustomization.yaml
│   │       └── patch-env.yaml
│   └── argocd-apps/
│       └── blog-api.yaml          # ArgoCD Application definition
├── charts/
│   └── blog-api/
│       ├── Chart.yaml
│       ├── values.yaml
│       └── templates/
│           ├── deployment.yaml
│           ├── service.yaml
│           └── ingress.yaml
├── README.md
```

---

## 📄 Ejemplo de `README.md` (resumido)

```md
# Blog API GitOps Template 🚀

Despliegue continuo de una API con:

- ✅ CI/CD con GitHub Actions
- ✅ GitOps via ArgoCD
- ✅ Canary o Blue/Green con Argo Rollouts
- ✅ Validación automática de health con AnalysisTemplate
- ✅ Multi-ambiente con Kustomize (staging / production)

## 🚀 Primeros pasos

1. Clona este repo y ajusta los valores en:
   - `argocd-apps/blog-api.yaml` → cambia `repoURL` y `path`
   - `.github/workflows/deploy-argocd.yml` → ajusta secretos

2. Instala:
   - [ArgoCD](https://argo-cd.readthedocs.io/)
   - [Argo Rollouts](https://argoproj.github.io/argo-rollouts/)
   - [Argo Notifications](https://argo-cd.readthedocs.io/en/stable/operator-manual/notifications/)

3. Crea los secretos necesarios:
   - `ARGOCD_AUTH_TOKEN`
   - `ARGOCD_SERVER`

4. Haz push a `main` y 🎉 ArgoCD se encargará del resto.

## 📂 Ambientes

- `/k8s/base` → configuración base
- `/k8s/overlays/staging` → staging (dev/test)
- `/k8s/overlays/production` → producción real

## 🧪 Validación automática

Se incluye un `AnalysisTemplate` que consulta `/health` para validar nuevas versiones antes de promoverlas.

```

---

## 🎁 ¿Qué sigue?

Te puedo:

1. **Preparar este repositorio como `.zip` descargable**
2. O ayudarte a **subirlo a un repo de GitHub tuyo**
3. O generar un **repositorio GitHub Template** directamente (requiere que lo hagas tú en GitHub con contenido que te paso)

---

