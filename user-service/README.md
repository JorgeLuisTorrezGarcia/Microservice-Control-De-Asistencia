# Microservicio de Gestión de Usuarios

user-service/
├── config/
│   └── database.js
├── src/
│   ├── controllers/
│   │   └── UserController.js
│   ├── models/
│   │   └── User.js
│   ├── repositories/
│   │   └── UserRepository.js
│   ├── services/
│   │   └── UserService.js
│   └── utils/
│       ├── httpUtils.js
│       └── passwordUtils.js
├── package.json
└── server.js

## Script de Inicialización de la Base de Datos
```sql
CREATE DATABASE IF NOT EXISTS users_db;

USE users_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    full_name VARCHAR(100),
    role ENUM('admin', 'professor', 'student') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario admin por defecto (contraseña: admin123)
INSERT INTO users (username, password_hash, full_name, role) 
VALUES (
    'admin', 
    '$2b$12$LQv3c1yqBWVHADV0oWdBee6Lekt5V7hC9VnU8uYbW7QG5p5p5p5p5', 
    'Administrador Principal', 
    'admin'
) ON DUPLICATE KEY UPDATE username = username;
```

## Endpoints Disponibles
POST /login - Autenticación de usuarios

GET /users - Obtener todos los usuarios

GET /users/:id - Obtener usuario por ID

POST /users - Crear nuevo usuario

PUT /users/:id - Actualizar usuario

DELETE /users/:id - Desactivar usuario