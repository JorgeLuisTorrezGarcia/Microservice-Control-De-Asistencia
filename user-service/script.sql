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

INSERT INTO users (username, password_hash, email, full_name, role) VALUES
('student01', '$2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student01@example.com', 'Ana Martínez', 'student'),
('student02', '$2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student02@example.com', 'Luis Hernández', 'student'),
('student03', '$2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student03@example.com', 'María López', 'student'),
('student04', '$2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student04@example.com', 'Carlos Ramírez', 'student'),
('student05', '$2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student05@example.com', 'Fernanda Ruiz', 'student'),
('student06', '$2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student06@example.com', 'Javier Torres', 'student'),
('student07', '$2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student07@example.com', 'Daniela Gómez', 'student'),
('student08', '$2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student08@example.com', 'Ricardo Pérez', 'student'),
('student09', '$2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student09@example.com', 'Valeria Sánchez', 'student'),
('student10', '$2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student10@example.com', 'Andrés Castillo', 'student');

INSERT INTO users (username, password_hash, email, full_name, role) VALUES
('student11', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student11@example.com', 'Elena Navarro', 'student'),
('student12', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student12@example.com', 'Gabriel Molina', 'student'),
('student13', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student13@example.com', 'Lucía Méndez', 'student'),
('student14', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student14@example.com', 'Héctor Jiménez', 'student'),
('student15', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student15@example.com', 'Paula Salas', 'student'),
('student16', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student16@example.com', 'Mario Castaño', 'student'),
('student17', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student17@example.com', 'Sara Ortega', 'student'),
('student18', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student18@example.com', 'Iván Rojas', 'student'),
('student19', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student19@example.com', 'Claudia Vega', 'student'),
('student20', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student20@example.com', 'Raúl Castro', 'student'),
('student21', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student21@example.com', 'Natalia Paredes', 'student'),
('student22', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student22@example.com', 'Álvaro Serrano', 'student'),
('student23', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student23@example.com', 'Isabel Duarte', 'student'),
('student24', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student24@example.com', 'Mateo Bravo', 'student'),
('student25', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student25@example.com', 'Renata Aguirre', 'student'),
('student26', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student26@example.com', 'Tomás Ibáñez', 'student'),
('student27', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student27@example.com', 'Camila Peña', 'student'),
('student28', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student28@example.com', 'Diego Ponce', 'student'),
('student29', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student29@example.com', 'Martina Cordero', 'student'),
('student30', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'student30@example.com', 'Emilio León', 'student');

### professor
INSERT INTO users (username, password_hash, email, full_name, role) VALUES
('prof01', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'prof01@example.com', 'Dr. Laura Fernández', 'professor'),
('prof02', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'prof02@example.com', 'Mtro. Jorge Herrera', 'professor'),
('prof03', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'prof03@example.com', 'Dra. Silvia Romero', 'professor'),
('prof04', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'prof04@example.com', 'Ing. Andrés Bautista', 'professor'),
('prof05', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'prof05@example.com', 'Lic. Karla Mendoza', 'professor'),
('prof06', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'prof06@example.com', 'Mtro. Sergio Gutiérrez', 'professor'),
('prof07', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'prof07@example.com', 'Dra. Patricia Silva', 'professor'),
('prof08', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'prof08@example.com', 'Ing. Roberto Ayala', 'professor'),
('prof09', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'prof09@example.com', 'Lic. Fernanda Valdés', 'professor'),
('prof10', '2a$10$F67ctBRBWgetnG7UqT6cee0nmKp7Pi9IKoex912hokxmpsAbIZQ/K', 'prof10@example.com', 'Mtra. Teresa Delgado', 'professor');
