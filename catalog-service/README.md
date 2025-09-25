# Catálogo de Servicios de Control de Asistencia
catalog-service/
├── config/
│   └── database.js
├── src/
│   ├── controllers/
│   │   └── SubjectController.js
│   ├── models/
│   │   ├── Subject.js
│   │   ├── SubjectStudent.js
│   │   └── SubjectTeacher.js
│   ├── repositories/
│   │   ├── SubjectRepository.js
│   │   ├── EnrollmentRepository.js
│   │   └── TeacherAssignmentRepository.js
│   ├── services/
│   │   └── SubjectService.js
│   └── utils/
│       └── httpUtils.js
├── package.json
└── server.js

## Endpoints Principales del Catalog Service
GET /subjects - Obtener todas las materias

POST /subjects - Crear nueva materia

GET /subjects/:id - Obtener materia por ID

PUT /subjects/:id - Actualizar materia

DELETE /subjects/:id - Eliminar materia

GET /subjects/:id/students - Obtener estudiantes inscritos

POST /subjects/:id/students - Inscribir estudiante

DELETE /subjects/:id/students/:studentId - Remover estudiante

GET /subjects/:id/teachers - Obtener profesores asignados

POST /subjects/:id/teachers - Asignar profesor

DELETE /subjects/:id/teachers/:teacherId - Remover profesor

GET /students/:id/subjects - Obtener materias de un estudiante

GET /teachers/:id/subjects - Obtener materias de un profesor