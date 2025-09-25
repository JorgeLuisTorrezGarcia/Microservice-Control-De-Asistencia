CREATE DATABASE IF NOT EXISTS catalog_db;

USE catalog_db;

-- Tabla de materias
CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de relación materias-profesores
CREATE TABLE IF NOT EXISTS subject_teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    professor_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_subject_teacher (subject_id, professor_id)
);

-- Tabla de relación materias-estudiantes (inscripciones)
CREATE TABLE IF NOT EXISTS subject_students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    student_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY unique_subject_student (subject_id, student_id)
);

-- Insertar algunas materias de ejemplo
INSERT IGNORE INTO subjects (code, name, description) VALUES
('MAT101', 'Cálculo I', 'Introducción al cálculo diferencial e integral'),
('FIS101', 'Física General', 'Mecánica clásica y termodinámica'),
('PROG101', 'Programación Básica', 'Fundamentos de programación con JavaScript'),
('BD101', 'Bases de Datos', 'Diseño e implementación de bases de datos relacionales');

-- Insertar algunas asignaciones de ejemplo (asumiendo que existen los usuarios con IDs 2, 3, etc.)
INSERT IGNORE INTO subject_teachers (subject_id, professor_id) VALUES
(1, 32), -- Profesor ID 2 enseña Cálculo I
(2, 32), -- Profesor ID 2 enseña Física General
(3, 33), -- Profesor ID 3 enseña Programación
(4, 33); -- Profesor ID 3 enseña Bases de Datos

-- Insertar algunas inscripciones de ejemplo (asumiendo que existen estudiantes con IDs 4, 5, etc.)
INSERT IGNORE INTO subject_students (subject_id, student_id) VALUES
(1, 4), (1, 5), (1, 2), -- Estudiantes en Cálculo I
(2, 4), (2, 5),         -- Estudiantes en Física General
(3, 6), (3, 7),         -- Estudiantes en Programación
(4, 4), (4, 7);         -- Estudiantes en Bases de Datos