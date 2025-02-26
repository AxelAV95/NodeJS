# Proyecto API Clave Dinámica

## Descripción

Este proyecto implementa una API de autenticación con claves dinámicas utilizando Node.js, MySQL y Docker. La API permite a los usuarios registrarse, iniciar sesión y generar claves dinámicas para una autenticación segura.

## Base de Datos

### Creación de la base de datos

```sql
CREATE DATABASE api-clave-dinamica;
```

### Creación de tablas

#### Tabla `Usuarios`

```sql
CREATE TABLE Usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL -- Almacenar como hash (ej. SHA-256 o bcrypt)
);
```

#### Tabla `Claves_Dinamicas`

```sql
CREATE TABLE Claves_Dinamicas (
    id_clave INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    fila INT CHECK (fila BETWEEN 1 AND 5), -- Filas de 1 a 5
    columna CHAR(1) CHECK (columna IN ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J')), -- Columnas A-J
    valor INT NOT NULL, -- Valor entero en esa posición
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    UNIQUE (id_usuario, fila, columna) -- Asegura que cada posición sea única por usuario
);
```

### Inserción de datos

#### Insertar claves dinámicas

```sql
INSERT INTO Claves_Dinamicas (id_usuario, fila, columna, valor) VALUES
(1, 1, 'A', 73), (1, 1, 'B', 19), (1, 1, 'C', 45), ..., (1, 5, 'J', 92);
```

#### Insertar usuarios

```sql
INSERT INTO Usuarios (nombre_usuario, contraseña)
VALUES ('axelav95', 'hash_de_contraseña');
```

### Consultas

#### Obtener ID de usuario

```sql
SELECT id_usuario
FROM Usuarios
WHERE nombre_usuario = 'axelav95' AND contraseña = 'hash_de_contraseña';
```

#### Obtener valores de claves dinámicas

```sql
SELECT valor
FROM Claves_Dinamicas
WHERE id_usuario = 1
AND ((fila = 5 AND columna = 'A')
     OR (fila = 2 AND columna = 'F')
     OR (fila = 3 AND columna = 'J'));
```

### Procedimiento almacenado

#### Crear procedimiento para generar claves dinámicas

```sql
DELIMITER //
CREATE PROCEDURE GenerarClaveDinamica(IN p_id_usuario INT)
BEGIN
    DECLARE v_fila INT DEFAULT 1;
    DECLARE v_columna CHAR(1);
    WHILE v_fila <= 5 DO
        SET v_columna = 'A';
        WHILE v_columna <= 'J' DO
            INSERT INTO Claves_Dinamicas (id_usuario, fila, columna, valor)
            VALUES (p_id_usuario, v_fila, v_columna, FLOOR(RAND() * 99) + 1); -- Enteros de 1 a 99
            SET v_columna = CHAR(ASCII(v_columna) + 1);
        END WHILE;
        SET v_fila = v_fila + 1;
    END WHILE;
END //
DELIMITER ;
```

#### Llamar al procedimiento

```sql
CALL GenerarClaveDinamica(1);
```

## Proyecto Node.js

### Inicialización del proyecto

```bash
npm init -y
npm install express mysql2 bcrypt dotenv nodemon
npm install jsonwebtoken express-validator
```

## Despliegue

### Instrucciones para construir y desplegar

#### Paso 1: Construir la imagen Docker

En el directorio raíz del proyecto (donde está el Dockerfile):

```bash
docker build -t auth-api:latest .
```

(Opcional) Sube la imagen a un registro como Docker Hub:

```bash
docker tag auth-api:latest tu_usuario/auth-api:latest
docker push tu_usuario/auth-api:latest
```

Actualiza `values.yaml` con el nombre de tu imagen si usas un registro.

#### Paso 2: Desplegar con Helm

Asegúrate de tener Helm instalado (`helm version`).

Instala el chart en tu clúster Kubernetes:

```bash
helm install auth-api ./auth-api-helm
```

Verifica el despliegue:

```bash
kubectl get pods
kubectl get svc
```

Si usaste `LoadBalancer`, obtén la IP externa con `kubectl get svc` y accede a la API en `http://<IP-externa>/api/auth`.

#### Paso 3: Configurar MySQL

Este despliegue asume que tienes un servicio MySQL corriendo en el clúster. Si no lo tienes, puedes agregar un chart de MySQL a Helm o desplegarlo manualmente. Ejemplo simple con Helm:

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install mysql bitnami/mysql --set auth.database=auth_db --set auth.username=tu_usuario --set auth.password=tu_contraseña
```

Asegúrate de que el nombre del servicio (`mysql-service`) coincida con `DB_HOST` en los manifests.

### Pruebas

Una vez desplegado:

Usa la IP externa del servicio (`kubectl get svc auth-api-service`) para probar los endpoints:

- `POST http://<IP-externa>/api/auth/register`
- `POST http://<IP-externa>/api/auth/login/step1`
- `POST http://<IP-externa>/api/auth/login/step2`

### Notas adicionales

- **Secretos**: En producción, no hardcodees valores en `values.yaml`. Usa un archivo `values-prod.yaml` separado o un gestor de secretos como Vault.
- **Escalabilidad**: Ajusta `replicaCount` en `values.yaml` según tus necesidades.
- **Persistencia**: Si MySQL no está configurado con volúmenes persistentes, perderás datos al reiniciar el pod. Añade un `PersistentVolumeClaim` si es necesario.
