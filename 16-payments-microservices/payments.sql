-- Crear la base de datos
CREATE DATABASE fitzone;
USE fitzone;  -- Para MySQL (en PostgreSQL, usa: \c fitzone)

-- Tabla `users`
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,  -- Para PostgreSQL, usa: SERIAL PRIMARY KEY
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',  -- Para PostgreSQL, usa: role VARCHAR(50) CHECK (role IN ('admin', 'user'))
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Para PostgreSQL, usa: updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    verified_at TIMESTAMP NULL
);

-- Tabla `plans`
CREATE TABLE plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration ENUM('monthly', 'yearly') NOT NULL,  -- Para PostgreSQL, usa: duration VARCHAR(50) CHECK (duration IN ('monthly', 'yearly'))
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla `subscriptions`
CREATE TABLE subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'canceled', 'pending') DEFAULT 'pending',  -- Para PostgreSQL, usa: status VARCHAR(50) CHECK (status IN ('active', 'canceled', 'pending'))
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
);

-- Tabla `payments`
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subscription_id INT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status ENUM('success', 'failed', 'pending') DEFAULT 'pending',  -- Para PostgreSQL, usa: status VARCHAR(50) CHECK (status IN ('success', 'failed', 'pending'))
    transaction_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL
);

-- Tabla `discounts`
CREATE TABLE discounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    type ENUM('percentage', 'fixed') NOT NULL,  -- Para PostgreSQL, usa: type VARCHAR(50) CHECK (type IN ('percentage', 'fixed'))
    value DECIMAL(10, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_uses INT NULL,
    used_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla `user_discounts`
CREATE TABLE user_discounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    discount_id INT NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE CASCADE
);

-- Tabla `logs`
CREATE TABLE logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE paypal_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- ID único de la suscripción
    user_id INT NOT NULL,                       -- ID del usuario (relación con la tabla users)
    plan_id VARCHAR(255) NOT NULL,              -- ID del plan en PayPal
    agreement_id VARCHAR(255) NOT NULL UNIQUE,  -- ID del acuerdo en PayPal
    status ENUM('pending', 'active', 'cancelled', 'suspended') DEFAULT 'pending', -- Estado de la suscripción
    start_date DATETIME,                        -- Fecha de inicio de la suscripción
    end_date DATETIME,                          -- Fecha de finalización de la suscripción
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del registro
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Fecha de última actualización
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Relación con la tabla de usuarios
);

CREATE TABLE paypal_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- ID único del plan
    plan_id VARCHAR(255) NOT NULL UNIQUE,       -- ID del plan en PayPal
    name VARCHAR(255) NOT NULL,                 -- Nombre del plan
    description TEXT,                           -- Descripción del plan
    price DECIMAL(10, 2) NOT NULL,              -- Precio del plan
    currency VARCHAR(10) DEFAULT 'USD',         -- Moneda del plan
    frequency ENUM('monthly', 'yearly') NOT NULL, -- Frecuencia del plan
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del registro
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Fecha de última actualización
);

CREATE TABLE paypal_webhook_events (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- ID único del evento
    event_id VARCHAR(255) NOT NULL UNIQUE,      -- ID del evento en PayPal
    event_type VARCHAR(255) NOT NULL,           -- Tipo de evento (ej: BILLING.SUBSCRIPTION.ACTIVATED)
    resource_id VARCHAR(255) NOT NULL,          -- ID del recurso relacionado (ej: ID de la suscripción)
    payload JSON NOT NULL,                      -- Datos completos del evento en formato JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha de creación del registro
);

-------------------------------------------

-- Insertar usuarios
INSERT INTO users (name, email, password_hash, role, verified_at) VALUES
('Admin User', 'admin@fitzone.com', 'hashed_password_1', 'admin', NOW()),
('Regular User', 'user@fitzone.com', 'hashed_password_2', 'user', NOW());

-- Insertar planes
INSERT INTO plans (name, description, price, duration) VALUES
('Plan Mensual', 'Acceso a todas las clases por un mes', 29.99, 'monthly'),
('Plan Anual', 'Acceso a todas las clases por un año', 299.99, 'yearly');

-- Insertar suscripciones
INSERT INTO subscriptions (user_id, plan_id, start_date, end_date, status) VALUES
(2, 1, '2023-10-01', '2023-11-01', 'active'),
(2, 2, '2023-10-01', '2024-10-01', 'pending');

-- Insertar pagos
INSERT INTO payments (user_id, subscription_id, amount, payment_method, status, transaction_id) VALUES
(2, 1, 29.99, 'credit_card', 'success', 'txn_123456'),
(2, 2, 299.99, 'paypal', 'pending', 'txn_654321');

-- Insertar descuentos
INSERT INTO discounts (code, type, value, start_date, end_date, max_uses) VALUES
('WELCOME10', 'percentage', 10.00, '2023-10-01', '2023-12-31', 100),
('FITNESS20', 'fixed', 20.00, '2023-10-01', '2023-10-31', NULL);

-- Insertar descuentos aplicados
INSERT INTO user_discounts (user_id, discount_id) VALUES
(2, 1);

-- Insertar registros de actividad
INSERT INTO logs (user_id, action, details) VALUES
(2, 'login', 'Inicio de sesión exitoso'),
(2, 'payment', 'Pago realizado con éxito, ID de transacción: txn_123456');

INSERT INTO paypal_plans (plan_id, name, description, price, currency, frequency)
VALUES ('P-123456789', 'Plan Mensual', 'Acceso a todas las funciones por un mes', 29.99, 'USD', 'monthly');

INSERT INTO paypal_subscriptions (user_id, plan_id, agreement_id, status, start_date, end_date)
VALUES (1, 'P-123456789', 'I-ABCDEF123', 'active', '2023-10-01 00:00:00', '2023-11-01 00:00:00');

INSERT INTO paypal_webhook_events (event_id, event_type, resource_id, payload)
VALUES ('WH-123456789', 'BILLING.SUBSCRIPTION.ACTIVATED', 'I-ABCDEF123', '{"event_type": "BILLING.SUBSCRIPTION.ACTIVATED", "resource": {"id": "I-ABCDEF123"}}');
