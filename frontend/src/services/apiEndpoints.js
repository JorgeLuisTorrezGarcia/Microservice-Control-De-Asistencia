export const API_ENDPOINTS = {
  // User Service
  LOGIN: 'http://localhost:3001/login',
  USERS: 'http://localhost:3001/users',
  
  // Catalog Service
  SUBJECTS: 'http://localhost:3002/subjects',
  SUBJECT_STUDENTS: (subjectId) => `http://localhost:3002/subjects/${subjectId}/students`,
  SUBJECT_TEACHERS: (subjectId) => `http://localhost:3002/subjects/${subjectId}/teachers`,
  TEACHER_SUBJECTS: (teacherId) => `http://localhost:3002/teachers/${teacherId}/subjects`,
  STUDENT_SUBJECTS: (studentId) => `http://localhost:3002/students/${studentId}/subjects`,
  
  // Attendance Service
  SESSIONS: 'http://localhost:3003/sessions',
  SESSION_RECORDS: (sessionId) => `http://localhost:3003/sessions/${sessionId}/records`,
  CLOSE_SESSION: (sessionId) => `http://localhost:3003/sessions/${sessionId}/close`,
  STUDENT_ATTENDANCE: (studentId) => `http://localhost:3003/attendance/student/${studentId}`,
  PROFESSOR_SESSIONS: (professorId) => `http://localhost:3003/professors/${professorId}/sessions`,
  SUBJECT_SESSIONS: (subjectId) => `http://localhost:3003/subjects/${subjectId}/sessions`
};