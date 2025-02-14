### Servicio de autenticación

# Registro de usuario:

```bash
POST http://localhost:3001/auth/register
Body: { "name": "John Doe", "email": "john@example.com", "password": "password123" }
```
# Inicio de sesión:
```bash
POST http://localhost:3001/auth/login
Body: { "email": "john@example.com", "password": "password123" }
```

### Servicio de usuarios

# Obtener información del usuario:
```bash
GET http://localhost:3002/users/me
Headers: { "Authorization": "Bearer <JWT>" }
```
# Actualizar información del usuario:
```bash
PUT http://localhost:3002/users/me
Headers: { "Authorization": "Bearer <JWT>" }
Body: { "name": "John Doe Updated", "email": "john.updated@example.com" }
```
# Eliminar usuario:
```bash
DELETE http://localhost:3002/users/me
Headers: { "Authorization": "Bearer <JWT>" }
```

### Servicio de suscripciones

# Crear una suscripción:

```bash
POST http://localhost:3003/subscriptions
Headers: { "Authorization": "Bearer <JWT>" }
Body: { "plan_id": 1, "start_date": "2023-10-01", "end_date": "2023-11-01", "status": "active" }
```

# Obtener información de una suscripción:

```bash
GET http://localhost:3003/subscriptions/1
Headers: { "Authorization": "Bearer <JWT>" }
```

# Actualizar una suscripción:
```bash
PUT http://localhost:3003/subscriptions/1
Headers: { "Authorization": "Bearer <JWT>" }
Body: { "start_date": "2023-10-01", "end_date": "2023-12-01", "status": "active" }
```

# Cancelar una suscripción:

```bash
DELETE http://localhost:3003/subscriptions/1
Headers: { "Authorization": "Bearer <JWT>" }
```

# Obtener suscripciones de un usuario:
```bash
GET http://localhost:3003/subscriptions/user/me
Headers: { "Authorization": "Bearer <JWT>" }
```

### Servicio de pagos

# Crear un pago:
```bash
POST http://localhost:3004/payments
Headers: { "Authorization": "Bearer <JWT>" }
Body: { "amount": 29.99, "subscription_id": 1 }
```

# Ejecutar un pago:

Después de que el usuario apruebe el pago en PayPal, redirige al usuario a la URL de éxito.
Llama al endpoint para ejecutar el pago:

```bash
POST http://localhost:3004/payments/execute
Headers: { "Authorization": "Bearer <JWT>" }
Body: { "paymentId": "PAYMENT_ID", "payerId": "PAYER_ID" }
```

# Webhook de PayPal:

```bash
Configura el webhook en el panel de PayPal para que apunte a http://localhost:3004/payments/webhook.
Procesa los eventos de PayPal (pagos completados, reembolsos, etc.).
```

### Servicio de descuentos

# Crear un cupón de descuento:

```bash
POST http://localhost:3005/discounts
Headers: { "Authorization": "Bearer <JWT>" }
Body: { "code": "WELCOME10", "type": "percentage", "value": 10, "start_date": "2023-10-01", "end_date": "2023-12-31", "max_uses": 100 }
```

# Validar un cupón de descuento:

```bash
GET http://localhost:3005/discounts/validate/WELCOME10
Actualizar un cupón de descuento:
PUT http://localhost:3005/discounts/1
Headers: { "Authorization": "Bearer <JWT>" }
Body: { "code": "WELCOME10", "type": "percentage", "value": 15, "start_date": "2023-10-01", "end_date": "2023-12-31", "max_uses": 100 }
```

# Eliminar un cupón de descuento:
```bash
DELETE http://localhost:3005/discounts/1
Headers: { "Authorization": "Bearer <JWT>" }
```

### Servicio de administración

# Obtener todos los usuarios:

```bash
GET http://localhost:3006/admin/users
Headers: { "Authorization": "Bearer <JWT>" }
```

# Obtener todas las suscripciones:

```bash
GET http://localhost:3006/admin/subscriptions
Headers: { "Authorization": "Bearer <JWT>" }
```

# Obtener todos los pagos:
```bash
GET http://localhost:3006/admin/payments
Headers: { "Authorization": "Bearer <JWT>" }
```

# Obtener todos los descuentos:

```bash
GET http://localhost:3006/admin/discounts
Headers: { "Authorization": "Bearer <JWT>" }
```

# Actualizar el rol de un usuario:
```bash
PUT http://localhost:3006/admin/users/1/role
Headers: { "Authorization": "Bearer <JWT>" }
Body: { "role": "admin" }
```

### Endpoints del Microservicio de PayPal

# Crear un Plan de Suscripción
```bash
POST http://localhost:3007/subscriptions/plans
Headers: { "Authorization": "Bearer <JWT>" }
Body:
{
    "name": "Plan Mensual",
    "description": "Acceso a todas las funciones por un mes",
    "price": 29.99,
    "frequency": "monthly"
}
```
# Crear un Acuerdo de Suscripción
```bash
POST http://localhost:3007/subscriptions/agreements
Headers: { "Authorization": "Bearer <JWT>" }
Body:
{
    "user_id": 1,
    "plan_id": "P-123456789",
    "start_date": "2023-10-01T00:00:00Z"
}
```

# Ejecutar un Acuerdo de Suscripción (Redirección de PayPal)

```bash
GET http://localhost:3007/subscriptions/execute?token=EC-XXXXX
Headers: { "Authorization": "Bearer <JWT>" }
```

# Cancelar un Acuerdo de Suscripción (Redirección de PayPal)

```bash
GET http://localhost:3007/subscriptions/cancel?token=EC-XXXXX
Headers: { "Authorization": "Bearer <JWT>" }
```

# Manejar Webhooks de PayPal
```bash
POST http://localhost:3007/subscriptions/webhook
Headers: { "Content-Type": "application/json" }
Body:
{
    "event_type": "BILLING.SUBSCRIPTION.ACTIVATED",
    "resource": {
        "id": "I-ABCDEF123"
    }
} ```


# Obtener Todos los Planes de Suscripción
```bash
GET http://localhost:3007/subscriptions/plans
Headers: { "Authorization": "Bearer <JWT>" }
```

# Obtener Todos los Acuerdos de Suscripción
```bash
GET http://localhost:3007/subscriptions/agreements
Headers: { "Authorization": "Bearer <JWT>" }
```

# Obtener un Acuerdo de Suscripción por ID

```bash
GET http://localhost:3007/subscriptions/agreements/I-ABCDEF123
Headers: { "Authorization": "Bearer <JWT>" }
```

# Actualizar el Estado de un Acuerdo de Suscripción
```bash
PUT http://localhost:3007/subscriptions/agreements/I-ABCDEF123
Headers: { "Authorization": "Bearer <JWT>" }
Body:
{
    "status": "cancelled"
}
```

# Obtener Todos los Eventos de Webhook
```bash
GET http://localhost:3007/subscriptions/webhook-events
Headers: { "Authorization": "Bearer <JWT>" }
```

# Obtener un Evento de Webhook por ID
```bash
GET http://localhost:3007/subscriptions/webhook-events/WH-123456789
Headers: { "Authorization": "Bearer <JWT>" }
```

-------------------------------------------------------------
# Dar permisos de ejecución a los scripts

Para los de cada carpeta del microservicio
```bash
chmod +x start.sh
```

```bash
chmod +x start-all.sh
chmod +x stop-all.sh
```

# Construir y levantar los contenedores:
```bash
./scripts/start-all.sh
```

# Detener los Contenedores:

```bash
./scripts/stop-all.sh
```

# Reconstruir un Microservicio:

Si haces cambios en un microservicio, puedes reconstruirlo y levantarlo nuevamente:

```bash
docker-compose up -d --build auth-service
```


# Acceso a los servicios

MySQL: Accede a la base de datos en localhost:3306.

Auth Service: Disponible en http://localhost:3001.

Subscription Service: Disponible en http://localhost:3003.

Payment Service: Disponible en http://localhost:3004.

PayPal Subscription Service: Disponible en http://localhost:3007.

### Comandos para Desplegar en Kubernetes

# Aplicar configuración de MySQL
```bash
kubectl apply -f kubernetes/mysql/
```

# Aplicar configuración de los microservicios
```bash
kubectl apply -f kubernetes/auth-service/
kubectl apply -f kubernetes/subscription-service/
kubectl apply -f kubernetes/paypal-subscription-service/
```

### Comandos para desplegar con Helm

# Instalar MySQL
```bash
helm install mysql helm/mysql/ \
  --set secrets.dbPassword=mysecretpassword
```

# Instalar Auth Service
```bash
helm install auth-service helm/auth-service/ \
  --set secrets.dbPassword=mysecretpassword \
  --set secrets.paypalClientId=myclientid \
  --set secrets.paypalClientSecret=myclientsecret
```

### Comandos Útiles

# Verificar los recursos desplegados:

```bash
kubectl get pods,svc,secrets,configmaps -l app=auth-service
```

# Actualizar el despliegue después de cambios:
```bash
helm upgrade auth-service ./helm/auth-service \
  --set secrets.dbPassword="new_password"
```

# Desinstalar el chart:
```bash
helm uninstall auth-service
```