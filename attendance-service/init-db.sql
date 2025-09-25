CREATE DATABASE IF NOT EXISTS attendance_db;

USE attendance_db;

-- Tabla de sesiones de asistencia
CREATE TABLE IF NOT EXISTS attendance_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    professor_id INT NOT NULL,
    session_date DATE NOT NULL,
    status ENUM('open', 'closed') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_session (subject_id, session_date)
);

-- Tabla de registros de asistencia individuales
CREATE TABLE IF NOT EXISTS attendance_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    student_id INT NOT NULL,
    status ENUM('present', 'absent') NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (session_id, student_id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_session_date ON attendance_sessions(session_date);
CREATE INDEX idx_session_status ON attendance_sessions(status);
CREATE INDEX idx_professor_id ON attendance_sessions(professor_id);
CREATE INDEX idx_student_id ON attendance_records(student_id);
CREATE INDEX idx_session_id ON attendance_records(session_id);
CREATE INDEX idx_attendance_status ON attendance_records(status);

-- Insertar algunas sesiones de ejemplo (asumiendo que existen las materias y usuarios)
INSERT IGNORE INTO attendance_sessions (subject_id, professor_id, session_date, status) VALUES
(1, 2, CURDATE(), 'open'),
(2, 2, CURDATE(), 'open'),
(3, 3, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'closed'),
(4, 3, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'closed');

-- Insertar algunos registros de asistencia de ejemplo
INSERT IGNORE INTO attendance_records (session_id, student_id, status) VALUES
-- Sesión 1 (Cálculo I hoy)
(1, 4, 'present'),
(1, 5, 'absent'),
(1, 6, 'present'),

-- Sesión 2 (Física General hoy)
(2, 4, 'present'),
(2, 5, 'present'),

-- Sesión 3 (Programación ayer)
(3, 6, 'absent'),
(3, 7, 'present'),

-- Sesión 4 (Bases de Datos anteayer)
(4, 4, 'present'),
(4, 7, 'absent');