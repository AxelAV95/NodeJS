## ✅ Checkpoint: Despliegue automático desde GitHub Actions → ArgoCD (CLI)

---

## 🧱 Paso 1: Crear token y login para ArgoCD CLI

### En tu clúster:

```bash
argocd account generate-token --account admin
```

Guarda ese token como secreto:

* 🔐 `ARGOCD_AUTH_TOKEN`
* 🔐 `ARGOCD_SERVER` (ej: `argocd.yourdomain.com`)

---

## 🗂️ Paso 2: `.github/workflows/deploy-argocd.yml`

```yaml
name: Deploy with ArgoCD

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Install ArgoCD CLI
        run: |
          curl -sSL -o argocd https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
          chmod +x argocd
          sudo mv argocd /usr/local/bin/

      - name: Sync Application
        run: |
          argocd login ${{ secrets.ARGOCD_SERVER }} --insecure --username admin --auth-token ${{ secrets.ARGOCD_AUTH_TOKEN }}
          argocd app sync blog-api
          argocd app wait blog-api --health --timeout 300
```

---

## 🧪 Opcional: Promoción automática de rollout

Si usas **blue/green**, puedes automatizar esto:

```yaml
      - name: Promote rollout
        run: |
          kubectl argo rollouts promote blog-api
```

Necesitas tener `kubectl` + `argo-rollouts` CLI:

```yaml
      - name: Install Argo Rollouts CLI
        run: |
          curl -LO https://github.com/argoproj/argo-rollouts/releases/latest/download/kubectl-argo-rollouts-linux-amd64
          chmod +x kubectl-argo-rollouts-linux-amd64
          sudo mv kubectl-argo-rollouts-linux-amd64 /usr/local/bin/kubectl-argo-rollouts
```

Y acceso a tu cluster (`KUBECONFIG` o GitHub-hosted runner con permisos via OIDC/ServiceAccount).

---

## ✅ Resultado

Cada `git push` a `main`:

* 🔄 ArgoCD sincroniza tu app (`Application`)
* 🔍 Valida health
* 🟩 (Opcional) Promueve la versión green de forma automatizada

---

